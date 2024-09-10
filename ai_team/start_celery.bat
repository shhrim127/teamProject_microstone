@echo off
call conda activate microstone

cd E:\microstone

call celery -A celery_app.celery purge -f
%SystemRoot%\System32\timeout.exe /t 1
start wt -w 0 nt -d . cmd /k "title Flask App & python main.py"
%SystemRoot%\System32\timeout.exe /t 1
start wt -w 0 nt -d . cmd /k "title PDF Queue Worker & celery -A celery_app.celery worker -Q PDF_queue -c 1 --loglevel=DEBUG -P gevent"
%SystemRoot%\System32\timeout.exe /t 1
start wt -w 0 nt -d . cmd /k "title OCR Queue Worker & celery -A celery_app.celery worker -Q OCR_queue -c 5 --loglevel=DEBUG --logfile=log/ocr_worker.log -P gevent"
%SystemRoot%\System32\timeout.exe /t 1
start wt -w 0 nt -d . cmd /k "title GPT Queue Worker & celery -A celery_app.celery worker -Q GPT_queue -c 300 --loglevel=DEBUG --logfile=log/gpt_worker.log -P gevent"
%SystemRoot%\System32\timeout.exe /t 1
start wt -w 0 nt -d . cmd /k "title Default Queue Worker & celery -A celery_app.celery worker -Q default_queue -c 1 --loglevel=DEBUG -P gevent"
