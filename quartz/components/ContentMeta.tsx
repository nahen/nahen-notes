import { Date } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n, ValidLocale } from "../i18n"
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
  showReadingTime: true,
  showComma: true,
}

function getFileExtension(url: string): string {
  const fileName = url.split('/').pop();
  if (fileName && fileName.includes('.')) {
    return fileName.split('.').pop() || '';
  }
  return '';
}

function createExternalLink(url: string, locale: ValidLocale): JSX.Element {
  const text = getFileExtension(url) === "pdf"
    ? i18n(locale).components.contentMeta.linkPdf
    : i18n(locale).components.contentMeta.linkText;

  return (
    <a class="external" target="_blank" href={url}>
      {text}
      <svg aria-hidden="true" class="external-icon" viewBox="0 0 512 512">
        <path d="M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"></path>
      </svg>
    </a>
  );
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        const createdDate = i18n(cfg.locale).components.contentMeta.createdDate
        segments.push(<span>{createdDate} <Date date={fileData.dates.created!} locale={cfg.locale} /></span>)

        const modifiedDate = i18n(cfg.locale).components.contentMeta.modifiedDate
        segments.push(<span>{modifiedDate} <Date date={fileData.dates.modified!} locale={cfg.locale} /></span>)
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      // YAMLにurlがあれば表示する
      if (fileData.frontmatter?.url) {
        segments.push(createExternalLink(fileData.frontmatter.url as string, cfg.locale))
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

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
