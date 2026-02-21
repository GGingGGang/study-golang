# 26. Reader Writer

## 이전 챕터 점검 (01~25)
- [ ] worker/pipeline에서 채널 흐름을 설명할 수 있다.

## 학습 목표
- Reader/Writer 기반 함수로 I/O를 추상화한다.

## 핵심 내용
- `io.Reader`, `io.Writer`
- 조합 가능한 스트림 처리
- 테스트 더블 사용 용이

## 예제 코드
```go
package main

import (
	"bytes"
	"io"
	"strings"
)

func ToUpper(r io.Reader, w io.Writer) error {
	b, err := io.ReadAll(r)
	if err != nil {
		return err
	}
	_, err = w.Write([]byte(strings.ToUpper(string(b))))
	return err
}

func main() {
	in := bytes.NewBufferString("go")
	out := new(bytes.Buffer)
	_ = ToUpper(in, out)
}
```

## 실습
- 파일 대신 bytes.Buffer로 테스트 가능한 변환 함수를 작성한다.

## 완료 기준
- [ ] Reader/Writer 시그니처를 사용했다.
- [ ] 에러를 호출자에게 전파했다.
- [ ] 버퍼 기반 테스트를 작성했다.
