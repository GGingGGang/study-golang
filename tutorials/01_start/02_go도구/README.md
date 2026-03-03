<!-- NAV_TOP_START -->
[Previous](../01_환경설정/README.md) | [Index](../../00-index.md) | [Next](../03_포맷문서/README.md)
<!-- NAV_TOP_END -->

# 02. Go 도구

## 이전 챕터 점검 (01)
- [ ] `go version`, `go env`로 환경 확인을 끝냈다.
- [ ] 기본 학습 폴더를 만들었다.

## 학습 목표
- `run`, `build`, `test`, `mod`의 역할을 구분한다.

## 핵심 내용
- `go run .`: 즉시 실행
- `go build ./...`: 빌드 검증
- `go test ./...`: 테스트 실행
- `go mod init`, `go mod tidy`: 모듈 관리

## 예제 코드
```go
package calc

func Add(a, b int) int { return a + b }
```

```go
package calc

import "testing"

func TestAdd(t *testing.T) {
	if got := Add(2, 3); got != 5 {
		t.Fatalf("want 5, got %d", got)
	}
}
```

## 실습
1. 모듈 초기화 후 `go test ./...` 실행.
2. `run`과 `build` 차이를 한 줄로 정리.

## 완료 기준
- [ ] 명령별 목적을 설명할 수 있다.
- [ ] 테스트 1개 이상을 통과시켰다.

<!-- NAV_BOTTOM_START -->
[Previous](../01_환경설정/README.md) | [Index](../../00-index.md) | [Next](../03_포맷문서/README.md)
<!-- NAV_BOTTOM_END -->

