# 29. time과 타이머

## 이전 챕터 점검 (01~28)
- [ ] JSON 파싱 + 검증 테스트를 통과시켰다.

## 학습 목표
- Timer/Ticker를 사용해 주기 작업을 제어한다.

## 핵심 내용
- `time.Duration`
- `time.NewTimer`, `time.NewTicker`
- 종료 신호와 함께 사용

## 예제 코드
```go
package main

import (
	"fmt"
	"time"
)

func main() {
	stop := time.After(350 * time.Millisecond)
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fmt.Println("tick")
		case <-stop:
			fmt.Println("stop")
			return
		}
	}
}
```

## 실습
- ticker 루프에 종료 채널을 추가하고 안전 종료를 구현한다.

## 완료 기준
- [ ] ticker stop을 누락하지 않았다.
- [ ] 종료 조건이 명확하다.
- [ ] 무한 루프 누수를 방지했다.
