import threading

class TokenBucket:
    _instance = None
    _lock = threading.Lock()  # 동일한 락을 클래스 수준에서 정의

    def __new__(cls, capacity=30000):
        if cls._instance is None:
            with cls._lock:  # 인스턴스 생성 시 락을 사용
                if cls._instance is None:
                    cls._instance = super(TokenBucket, cls).__new__(cls)
        return cls._instance

    def __init__(self, capacity=30000):
        if not hasattr(self, '_initialized'):
            self.capacity = float(capacity)
            self._tokens = capacity
            self._initialized = True

    def add_tokens(self, tokens):
        """Add tokens to the bucket."""
        with self._lock:  # 락을 사용하여 동시에 접근하지 않도록 보호
            self._tokens = min(self.capacity, self._tokens + tokens)
            #print(f"[토큰 버킷] : {tokens} 토큰을 추가합니다. (현제 남은토큰 {self._tokens})")

    def force_consume(self, tokens):
        """Forcefully consume tokens, even if there are not enough."""
        with self._lock:  # 락을 사용하여 토큰 차감이 안전하게 수행되도록 보호
            #print(f"[토큰 버킷] 현제 남은 토큰 : {self._tokens}")
            self._tokens -= tokens
            if self._tokens < 0:
                self._tokens = 0
            #print(f"[토큰 버킷] : {self._tokens} / {self.capacity} ( - {tokens})")

    def can_consume(self, tokens=1):
        """Check if the required tokens can be consumed."""
        with self._lock:  # 락을 사용하여 토큰을 안전하게 소비
            if tokens <= self._tokens:
                self._tokens -= tokens
                #print(f"[토큰 버킷] : {tokens} 소비하여 요청을 보냅니다. (현제 남은토큰 {self._tokens})")
                return True
            return False
    
    def get_tokens(self):
        """Return the current number of tokens in the bucket."""
        with self._lock:  # 락을 사용하여 남은 토큰 수를 안전하게 반환
            return self._tokens
