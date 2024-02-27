interface Translation<Locale extends string> {
    locale: Locale,
    translation: any
}

export { Translation };