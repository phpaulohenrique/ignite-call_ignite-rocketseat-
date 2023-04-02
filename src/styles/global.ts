import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
    '*': {
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
        fontFamily: '$default',
    },
    body: {
        backgroundColor: '$gray800',
        color: '$gray100',
        '-webkit-font-smoothing': 'antialiased',
    },
    media: {
        bp1: '(max-width: 640px)',
        bp2: '(max-width: 768px)',
        bp3: '(max-width: 1024px)',
    },
})
