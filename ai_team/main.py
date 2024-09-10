from gevent import monkey
monkey.patch_all()
from flask import request, jsonify, url_for
import json
from celery_app import app,celery
from module.celery_tasks.tasks import process_pdf,create_questions

# 기본 루트
@app.route('/')
def hello_world():
    return jsonify({
        "state": "ERROR", 
        "message": "url not found"}), 404

# PDF 데이터 전처리 요청 data 에는 PDF URL를 받는걸로 함
@app.route('/pdf-data-preprocessing', methods=['POST'])
def pdf_data_pipeline():
    data = request.get_json()
    pdf_path = data.get('pdf_path')
    if not pdf_path:
        return jsonify({
            "state": "ERROR",
            "message": "PDF 파일 경로가 잘못되었습니다.",
            "task_id": None,
            "result": None
        }), 400
    
    task = process_pdf.apply_async(args=[pdf_path])
    response = {
        'state': "PENDING",
        'task_id': task.id,
        'message': "작업이 대기중입니다.",
        'result': None,
        
        'status_url': url_for('get_task_status', task_id=task.id, _external=True)
    }
    return jsonify(response), 202
    
# 작업 상태 확인 엔드포인트
@app.route('/status/<task_id>')
def get_task_status(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'task_id': task.id,
            'message': "작업이 대기중입니다.",
            'result': None
        }
    elif task.state == 'STARTED':
        response = {
            'state': task.state,
            'task_id': task.id,
            'message': "작업이 진행중입니다.",
            'result': None
        }
    elif task.state == 'SUCCESS':
        response = {
            'state': task.state,
            'task_id': task.id,
            'message': "작업이 완료되었습니다.",
            'result': task.result
        }
    elif task.state == 'FAILURE':
        # 작업이 실패한 경우 예외 정보 포함
        response = {
            'state': task.state,
            'task_id': task.id,
            'message': f"작업이 실패했습니다: {str(task.info)}",
            'result': None,
            
            'traceback': task.traceback  # 자세한 오류 정보
        }
    else:
        # 기타 상태
        response = {
            'state': task.state,
            'task_id': task.id,
            'message': "작업 상태를 가져오는 중 문제가 발생했습니다.",
            'result': None
        }
    
    return jsonify(response)

# 문제 생성하는 API
@app.route('/create-quiz-questions', methods=['POST'])
def questions():
    data = request.get_json()
    uuid_path = data.get('uuid')
    if not uuid_path:
        return jsonify({
            "state": "ERROR",
            "message": "PDF UUID가 잘못되었습니다.",
            "task_id": None,
            "result": None
        }), 400
    task = create_questions.apply(args=[uuid_path])
    response = {
        'state': "PENDING",
        'task_id': None,
        'message': "문제 생성 작업이 진행 중입니다.",
        'result': json.loads(task.result),
    }
    return jsonify(response), 202 

if __name__ == '__main__':
    app.run('0.0.0.0',port=5000,debug=False)
