import i18n from '../i18n'
import type { useAppStore } from '../stores/app'

let contactConsoleLogged = false

/** 与页脚「联系我们」一致：Telegram + 加入社群通知（URL 来自 contact.community 或 whatsapp） */
export function logContactConsoleOnce(appStore: ReturnType<typeof useAppStore>) {
    if (contactConsoleLogged) return
    if (!appStore.config) return

    contactConsoleLogged = true

    const contact = appStore.config.contact as Record<string, string | undefined> | undefined
    if (!contact) return

    const tg = contact.telegram?.trim()
    const community = contact.community?.trim() || contact.whatsapp?.trim()
    if (!tg && !community) return

    const t = i18n.global.t as (key: string) => string

    console.log(
        `%c${t('footer.contact')}`,
        'color:#424245;font-weight:600;font-size:12px;',
    )
    if (tg) {
        console.log(`Telegram → ${tg}`)
    }
    if (community) {
        console.log(`${t('footer.communityNotify')} → ${community}`)
    }
}
