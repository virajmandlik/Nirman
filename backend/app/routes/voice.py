from flask import Blueprint, request, jsonify
import os
from datetime import datetime
import logging
import requests
from werkzeug.utils import secure_filename

voice_bp = Blueprint('voice', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# WorqHat API configuration
WORQHAT_API_URL = "https://api.worqhat.com/api/ai/speech-text"
WORQHAT_API_KEY = os.getenv("WORQHAT_API_KEY")  # Make sure to set this in your environment variables

@voice_bp.route('/api/voice/process', methods=['POST'])
def process_voice():
    try:
        if 'audio' not in request.files:
            logger.error("No audio file in request")
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        if audio_file.filename == '':
            logger.error("Empty audio filename")
            return jsonify({'error': 'No selected file'}), 400

        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(f'voice_{timestamp}.webm')
        file_path = os.path.join(upload_dir, filename)

        # Save the file
        audio_file.save(file_path)
        logger.info(f"Audio file saved successfully: {filename}")

        # Prepare the request to WorqHat API
        headers = {
            'Authorization': f'Bearer {WORQHAT_API_KEY}',
            'Content-Type': 'multipart/form-data'
        }

        # Create form data
        files = {
            'audio': (filename, open(file_path, 'rb'), 'audio/webm')
        }
        
        data = {
            'keep_fillers': 'false',
            'enable_formatting': 'true',
            'enable_profanity_filters': 'true'
        }

        # Make the API request
        response = requests.post(
            WORQHAT_API_URL,
            headers=headers,
            files=files,
            data=data
        )

        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            logger.info(f"Speech recognition successful: {result}")
            
            # Clean up the temporary file
            os.remove(file_path)
            
            return jsonify({
                'message': 'Voice processing completed',
                'text': result.get('data', {}).get('text', ''),
                'processingTime': result.get('data', {}).get('processingTime', 0),
                'processingId': result.get('data', {}).get('processingId', '')
            }), 200
        else:
            logger.error(f"WorqHat API error: {response.text}")
            return jsonify({
                'error': 'Failed to process speech',
                'details': response.text
            }), response.status_code

    except Exception as e:
        logger.error(f"Error processing voice: {str(e)}")
        return jsonify({'error': str(e)}), 500 