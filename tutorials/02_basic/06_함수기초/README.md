<!-- NAV_TOP_START -->
[Previous](../05_제어문스코프/README.md) | [Index](../../00-index.md) | [Next](../07_포인터값/README.md)
<!-- NAV_TOP_END -->

# 06. 함수 기초

## 이전 챕터 점검 (01~05)
- [ ] 제어문과 에러 반환 패턴을 사용할 수 있다.

## 학습 목표
- 함수 중심으로 코드 경계를 나눈다.
- defer와 클로저의 실행 시점을 이해한다.

## 핵심 내용
- 다중 반환: 값 + error
- `defer`로 자원 정리
- 클로저 상태 캡처

## 예제 코드
```go
package main

import (
	"fmt"
	"os"
)

func firstByte(path string) (byte, error) {
	f, err := os.Open(path)
	if err != nil {
		return 0, err
	}
	defer f.Close()

	buf := make([]byte, 1)
	_, err = f.Read(buf)
	return buf[0], err
}

func counter() func() int {
	n := 0
	return func() int { n++; return n }
}

func main() {
	next := counter()
	fmt.Println(next(), next())
}
```

## 실습
- 파일 읽기 함수의 실패 경로 테스트를 작성한다.

## 완료 기준
- [ ] defer 누락 없는 자원 정리 코드를 작성했다.
- [ ] 클로저 캡처 동작을 설명할 수 있다.

<!-- NAV_BOTTOM_START -->
[Previous](../05_제어문스코프/README.md) | [Index](../../00-index.md) | [Next](../07_포인터값/README.md)
<!-- NAV_BOTTOM_END -->

