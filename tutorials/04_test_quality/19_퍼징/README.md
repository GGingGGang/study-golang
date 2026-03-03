<!-- NAV_TOP_START -->
[Previous](../18_벤치마크/README.md) | [Index](../../00-index.md) | [Next](../20_정적분석/README.md)
<!-- NAV_TOP_END -->

# 19. 퍼징

## 이전 챕터 점검 (01~18)
- [ ] 벤치마크 실행 및 해석 경험이 있다.

## 학습 목표
- 퍼징으로 예외 입력을 찾아 안정성을 높인다.

## 핵심 내용
- `go test -fuzz=.`
- 발견 케이스를 회귀 테스트로 고정

## 예제 코드
```go
package parse

import "strings"

func ParseKV(s string) (string, string, bool) {
	parts := strings.SplitN(s, "=", 2)
	if len(parts) != 2 {
		return "", "", false
	}
	return parts[0], parts[1], true
}
```

```go
package parse

import "testing"

func FuzzParseKV(f *testing.F) {
	f.Add("a=b")
	f.Add("=")
	f.Fuzz(func(t *testing.T, in string) {
		_, _, _ = ParseKV(in)
	})
}
```

## 실습
- 퍼징으로 찾은 입력을 일반 테스트 케이스에 추가

## 완료 기준
- [ ] fuzz 실행 로그를 남겼다.
- [ ] 재현 케이스를 regression test로 고정했다.
- [ ] panic 없이 동작한다.

<!-- NAV_BOTTOM_START -->
[Previous](../18_벤치마크/README.md) | [Index](../../00-index.md) | [Next](../20_정적분석/README.md)
<!-- NAV_BOTTOM_END -->

