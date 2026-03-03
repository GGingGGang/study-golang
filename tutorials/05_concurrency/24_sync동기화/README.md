<!-- NAV_TOP_START -->
[Previous](../23_컨텍스트/README.md) | [Index](../../00-index.md) | [Next](../25_동시성패턴/README.md)
<!-- NAV_TOP_END -->

# 24. sync 동기화

## 이전 챕터 점검 (01~23)
- [ ] context 취소/전파 코드를 실행해봤다.

## 학습 목표
- 공유 상태를 안전하게 동기화한다.

## 핵심 내용
- `sync.Mutex`
- `sync.WaitGroup`
- `sync.Once`

## 예제 코드
```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var mu sync.Mutex
	var wg sync.WaitGroup
	count := 0

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			count++
			mu.Unlock()
		}()
	}

	wg.Wait()
	fmt.Println("count:", count)
}
```

## 실습
- 공유 map 쓰기 작업을 mutex 보호 버전/미보호 버전으로 비교한다.

## 완료 기준
- [ ] race 가능 지점을 설명할 수 있다.
- [ ] 동기화 후 결과가 안정적이다.
- [ ] WaitGroup 누락 없이 종료한다.

<!-- NAV_BOTTOM_START -->
[Previous](../23_컨텍스트/README.md) | [Index](../../00-index.md) | [Next](../25_동시성패턴/README.md)
<!-- NAV_BOTTOM_END -->

