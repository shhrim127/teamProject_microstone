
# __init__.py

from module.celery_tasks.token_bucket import TokenBucket

# TokenBucket의 싱글톤 인스턴스 생성
token_bucket_instance = TokenBucket(capacity=30000)

__all__ = ['token_bucket_instance']

