<!-- NAV_TOP_START -->
[Previous](../26_reader_writer/README.md) | [Index](../../00-index.md) | [Next](../28_json처리/README.md)
<!-- NAV_TOP_END -->

# 27. 파일과 경로

## 이전 챕터 점검 (01~26)
- [ ] Reader/Writer 기반 테스트 가능한 코드를 작성했다.

## 학습 목표
- 파일/디렉토리/경로 처리를 안전하게 구현한다.

## 핵심 내용
- `os.ReadDir`, `os.ReadFile`
- `filepath.Join`, `filepath.Ext`
- 경로 독립성

## 예제 코드
```go
package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func ListGoFiles(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	files := make([]string, 0)
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if filepath.Ext(e.Name()) == ".go" {
			files = append(files, filepath.Join(dir, e.Name()))
		}
	}
	return files, nil
}

func main() {
	files, _ := ListGoFiles(".")
	fmt.Println(len(files))
}
```

## 실습
- 확장자 필터 함수를 만들고 테스트한다.

## 완료 기준
- [ ] 경로 결합을 filepath로 처리했다.
- [ ] 파일 에러를 적절히 반환했다.
- [ ] 디렉토리/파일 구분을 처리했다.

<!-- NAV_BOTTOM_START -->
[Previous](../26_reader_writer/README.md) | [Index](../../00-index.md) | [Next](../28_json처리/README.md)
<!-- NAV_BOTTOM_END -->

