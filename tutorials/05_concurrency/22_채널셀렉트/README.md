<!-- NAV_TOP_START -->
[Previous](../21_고루틴/README.md) | [Index](../../00-index.md) | [Next](../23_컨텍스트/README.md)
<!-- NAV_TOP_END -->

# 22. 채널과 셀렉트

## 이전 챕터 점검 (01~21)
- [ ] 21장에서 고루틴 종료 패턴을 직접 적용했다.

## 학습 목표
- 채널 close 책임과 select 패턴을 정확히 사용한다.

## 핵심 내용
- 송신 측 close 원칙
- 수신 측 range 종료
- select timeout/cancel

## 예제 코드
```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan int)
	go func() {
		defer close(ch)
		for i := 1; i <= 3; i++ {
			ch <- i
		}
	}()

	for {
		select {
		case v, ok := <-ch:
			if !ok {
				fmt.Println("closed")
				return
			}
			fmt.Println(v)
		case <-time.After(200 * time.Millisecond):
			fmt.Println("timeout")
			return
		}
	}
}
```

## 실습
- fan-in 채널 2개를 select로 합치고 종료 조건을 추가한다.

## 완료 기준
- [ ] close 주체를 명확히 정했다.
- [ ] timeout 경로를 다뤘다.
- [ ] panic 없이 종료된다.

<!-- NAV_BOTTOM_START -->
[Previous](../21_고루틴/README.md) | [Index](../../00-index.md) | [Next](../23_컨텍스트/README.md)
<!-- NAV_BOTTOM_END -->

