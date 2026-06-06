'use client'

type Props = {
    error: Error,
    reset: () => void
}

export default function ErrorPage({error, reset}: Props) {
    return (

        <div>
            <h1>{error.message}</h1>
            <button onClick={reset}>Попробовать снова</button>
        </div>
    )
}