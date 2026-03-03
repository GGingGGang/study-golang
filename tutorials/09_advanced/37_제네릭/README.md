<!-- NAV_TOP_START -->
[Previous](../../08_dbperf/36_pprof/README.md) | [Index](../../00-index.md) | [Next](../38_리플렉션/README.md)
<!-- NAV_TOP_END -->

# 37. 제네릭

## 이전 챕터 점검 (01~36)
- [ ] 성능 개선은 측정으로 검증했다.

## 학습 목표
- 중복 제거 목적의 최소 제네릭을 적용한다.

## 핵심 내용
- type parameter
- constraint 최소화
- 가독성 우선

## 예제 코드
```go
package main

import "fmt"

type Number interface {
	~int | ~int64 | ~float64
}

func Sum[T Number](a, b T) T {
	return a + b
}

func main() {
	fmt.Println(Sum(1, 2))
	fmt.Println(Sum(1.5, 2.5))
}
```

## 실습
- 중복된 `int`, `float64` 합계 함수를 제네릭으로 통합한다.

## 완료 기준
- [ ] 제네릭 도입 전/후 중복량을 비교했다.
- [ ] constraint를 과도하게 늘리지 않았다.
- [ ] 읽기 쉬운 시그니처를 유지했다.

<!-- NAV_BOTTOM_START -->
[Previous](../../08_dbperf/36_pprof/README.md) | [Index](../../00-index.md) | [Next](../38_리플렉션/README.md)
<!-- NAV_BOTTOM_END -->

