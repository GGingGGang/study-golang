<!-- NAV_TOP_START -->
[Previous](../35_트랜잭션풀/README.md) | [Index](../../00-index.md) | [Next](../../09_advanced/37_제네릭/README.md)
<!-- NAV_TOP_END -->

# 36. pprof

## 이전 챕터 점검 (01~35)
- [ ] 35장의 트랜잭션 함수에 timeout context를 적용했다.

## 학습 목표
- pprof로 병목을 찾고 개선 전후를 비교한다.

## 핵심 내용
- `go test -bench` + `pprof`
- CPU/Heap 프로파일
- 수치 기반 개선 검증

## 예제 코드
```go
package main

import (
	"runtime/pprof"
	"os"
)

func heavy(n int) int {
	s := 0
	for i := 0; i < n; i++ {
		s += i
	}
	return s
}

func main() {
	f, _ := os.Create("cpu.prof")
	defer f.Close()
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()

	_ = heavy(50_000_000)
}
```

## 실습
- 개선 전/후 벤치마크 결과를 표로 기록한다.

## 완료 기준
- [ ] profile 파일을 생성했다.
- [ ] 병목 함수를 식별했다.
- [ ] 개선 효과를 수치로 남겼다.

<!-- NAV_BOTTOM_START -->
[Previous](../35_트랜잭션풀/README.md) | [Index](../../00-index.md) | [Next](../../09_advanced/37_제네릭/README.md)
<!-- NAV_BOTTOM_END -->

