import { css } from "@emotion/react"
import { useRouter } from "next/router"
import { colors } from "../../../../styles/constants"
import Button from "../Button"

export default function SecessionPopup() {
    const router = useRouter()

    const handleConfirm = () => {
        router.push("/")
    }

    return(
        <main css={mainCss}>
            <div css={boxCss}>
                <h1 css={titleCss}>탈퇴가 완료되었습니다.</h1>
                <Button title="확인" onClick={handleConfirm}/>
            </div>
        </main>
    )
}

const mainCss = css`
    z-index: 999;
    position: absolute;
    width: 100%;
    height: 100vh;
    background: rgba(4, 4, 5, 0.30);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
`

const boxCss = css`
    width: 500px;
    height: 188px;
    background-color: white;
    padding: 40px 20px 20px 20px;
    border-radius: 12px;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.20);
    margin-bottom: 2rem;
`

//font
const titleCss = css`
    color: ${colors.grayscale[1000]};
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 160%; 
    margin-bottom: 40px;
`