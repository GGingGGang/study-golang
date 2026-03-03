<!-- NAV_TOP_START -->
[Previous](../../02_basic/12_에러처리/README.md) | [Index](../../00-index.md) | [Next](../14_패키지분리/README.md)
<!-- NAV_TOP_END -->

# 13. 모듈 관리

## 이전 챕터 점검 (01~12)
- [ ] `02-Basic/12-에러-래핑-분류-전파/README.md`의 `errors.Is/As` 예제를 다시 읽었다.
- [ ] 지금까지 작성한 코드에 `go test ./...`를 수행했다.

## 학습 목표
- `go.mod`와 `go.sum`의 역할을 구분한다.
- 의존성 버전을 재현 가능하게 관리한다.

## 핵심 내용
- `go mod init`: 모듈 시작
- `go mod tidy`: 사용 의존성 정리
- `go.sum`: 무결성 체크섬 기록

## 예제 코드
```go
package calc

func Add(a, b int) int {
	return a + b
}
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
- 새 폴더에서 `go mod init example.com/study13` 실행
- 위 코드 작성 후 `go test ./...` 실행
- 임의 의존성 추가 후 `go mod tidy`로 정리

## 완료 기준
- [ ] `go.mod`와 `go.sum` 차이를 설명할 수 있다.
- [ ] 테스트가 통과한다.
- [ ] 정리 전후 `go.mod` 변화를 메모했다.

<!-- NAV_BOTTOM_START -->
[Previous](../../02_basic/12_에러처리/README.md) | [Index](../../00-index.md) | [Next](../14_패키지분리/README.md)
<!-- NAV_BOTTOM_END -->

