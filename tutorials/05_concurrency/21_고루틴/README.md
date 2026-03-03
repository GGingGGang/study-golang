<!-- NAV_TOP_START -->
[Previous](../../04_test_quality/20_정적분석/README.md) | [Index](../../00-index.md) | [Next](../22_채널셀렉트/README.md)
<!-- NAV_TOP_END -->

# 21. 고루틴

## 이전 챕터 점검 (01~20)
- [ ] 20장까지의 테스트/벤치/vet 흐름을 한 번 실행했다.

## 학습 목표
- 고루틴 누수를 막는 종료 패턴을 구현한다.

## 핵심 내용
- 종료 신호 채널
- 고루틴 수명 관리
- leak 탐지 습관

## 예제 코드
```go
package main

import (
	"fmt"
	"time"
)

func worker(done <-chan struct{}, out chan<- int) {
	defer close(out)
	for i := 0; i < 3; i++ {
		select {
		case <-done:
			return
		case out <- i:
			time.Sleep(10 * time.Millisecond)
		}
	}
}

func main() {
	done := make(chan struct{})
	out := make(chan int)
	go worker(done, out)

	for v := range out {
		fmt.Println(v)
		if v == 1 {
			close(done)
		}
	}
}
```

## 실습
- 종료 신호 없는 고루틴 예제를 만들고 leak를 재현한 뒤 수정한다.

## 완료 기준
- [ ] 종료 경로가 명확하다.
- [ ] 고루틴이 남지 않는다.
- [ ] 테스트 또는 로그로 종료를 확인했다.

<!-- NAV_BOTTOM_START -->
[Previous](../../04_test_quality/20_정적분석/README.md) | [Index](../../00-index.md) | [Next](../22_채널셀렉트/README.md)
<!-- NAV_BOTTOM_END -->

