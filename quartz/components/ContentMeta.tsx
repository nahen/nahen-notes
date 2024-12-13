import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: false,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        // const createdDate = i18n(cfg.locale).components.contentMeta.createdDate({
        //   date: formatDate(fileData.dates.created!, cfg.locale),
        // })
        // segments.push(createdDate);
        segments.push(<Date date={fileData.dates.created!} locale={cfg.locale} />)

        // const modifiedDate = i18n(cfg.locale).components.contentMeta.modifiedDate({
        //   date: formatDate(fileData.dates.modified!, cfg.locale),
        // })
        // segments.push(modifiedDate)
        segments.push(<Date date={fileData.dates.modified!} locale={cfg.locale} />)
      }
      
      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      // YAMLにurlがあれば表示する
      if (fileData.frontmatter && fileData.frontmatter["url"]) {
          const url = fileData.frontmatter["url"] as string

          let text: string = ""
          if (getFileExtension(url) == "pdf") {
            text = i18n(cfg.locale).components.contentMeta.linkPdf
          } else {
            // 空文字列の場合はWebサイト
            text = i18n(cfg.locale).components.contentMeta.linkText
          }
          segmentsElements.push(<a class="external" target="_blank" href={url}>{text}<svg aria-hidden="true" class="external-icon" viewBox="0 0 512 512"><path d="M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"></path></svg></a>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  function getFileExtension(url: string): string {
    // URLの最後のセグメントを取得
    const fileName = url.split('/').pop();
    // ファイル名が存在し、ドットを含む場合
    if (fileName && fileName.includes('.')) {
      // 最後のドット以降の文字列（拡張子）を返す
      return fileName.split('.').pop() || '';
    }
    // 拡張子が見つからない場合は空文字列を返す
    return '';
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
