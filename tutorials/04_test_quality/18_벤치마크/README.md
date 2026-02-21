# 18. 벤치마크

## 이전 챕터 점검 (01~17)
- [ ] 테스트 구조(단위/예제/서브테스트)를 구분해 작성했다.

## 학습 목표
- 벤치마크로 구현 간 성능 차이를 정량화한다.

## 핵심 내용
- `BenchmarkXxx(*testing.B)`
- `-bench`, `-benchmem`
- 측정 없이 최적화하지 않기

## 예제 코드
```go
package joinx

import "strings"

func Plus(a, b string) string {
	return a + b
}

func Builder(a, b string) string {
	var sb strings.Builder
	sb.Grow(len(a) + len(b))
	sb.WriteString(a)
	sb.WriteString(b)
	return sb.String()
}
```

```go
package joinx

import "testing"

func BenchmarkPlus(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = Plus("hello", "world")
	}
}

func BenchmarkBuilder(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = Builder("hello", "world")
	}
}
```

## 실습
- `go test -bench . -benchmem` 실행 후 결과 기록

## 완료 기준
- [ ] ns/op, B/op, allocs/op를 비교했다.
- [ ] 성능 주장에 수치를 첨부했다.
- [ ] 개선 전후 근거를 메모했다.
