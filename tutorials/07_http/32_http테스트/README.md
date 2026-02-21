# 32. HTTP 테스트

## 이전 챕터 점검 (01~31)
- [ ] 31장에서 클라이언트 timeout/retry를 구현했다.

## 학습 목표
- httptest로 핸들러를 단위/통합 테스트한다.

## 핵심 내용
- `httptest.NewRecorder`
- `httptest.NewRequest`
- 응답 코드/바디 검증

## 예제 코드
```go
package api

import (
	"fmt"
	"net/http"
)

func Health(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "ok")
}
```

```go
package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	Health(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	if rr.Body.String() != "ok" {
		t.Fatalf("want ok, got %q", rr.Body.String())
	}
}
```

## 실습
- 에러 응답 핸들러를 추가하고 400/500 테스트를 각각 작성한다.

## 완료 기준
- [ ] 상태코드와 바디를 함께 검증했다.
- [ ] 정상/실패 케이스를 분리했다.
- [ ] 테스트 이름으로 시나리오가 드러난다.
