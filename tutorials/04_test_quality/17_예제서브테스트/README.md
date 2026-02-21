# 17. 예제와 서브테스트

## 이전 챕터 점검 (01~16)
- [ ] 16장의 테이블 테스트를 재사용 가능 형태로 정리했다.

## 학습 목표
- Example 테스트와 subtest를 역할별로 분리한다.

## 핵심 내용
- `ExampleXxx`는 문서 겸 실행 검증
- `t.Run`으로 시나리오별 분리

## 예제 코드
```go
package strx

func Prefix(s, p string) string {
	return p + s
}
```

```go
package strx

import (
	"fmt"
	"testing"
)

func TestPrefix(t *testing.T) {
	t.Run("empty", func(t *testing.T) {
		if got := Prefix("", "hi-"); got != "hi-" {
			t.Fatalf("got %q", got)
		}
	})
	t.Run("normal", func(t *testing.T) {
		if got := Prefix("go", "hi-"); got != "hi-go" {
			t.Fatalf("got %q", got)
		}
	})
}

func ExamplePrefix() {
	fmt.Println(Prefix("go", "hi-"))
	// Output: hi-go
}
```

## 실습
- 기존 함수 1개를 Example + subtest 조합으로 검증

## 완료 기준
- [ ] Example 출력이 통과한다.
- [ ] subtest 이름이 시나리오를 설명한다.
- [ ] 중복 setup을 줄였다.
