import { CustomButton } from "@/components/CustomButton"
import { SendHorizonal } from "lucide-react"

function Start({ setStarted }: any) {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)]">
      <div className="flex flex-col gap-5 justify-center items-center">
        <p className="font-semibold text-lg sm:text-2xl">Get Started to talk with strangers.</p>
        <p className="sm:text-lg">Total 20000 people online</p>
        <CustomButton onClick={() => setStarted(true)}>Start Now <SendHorizonal className="ml-1" size={20} /></CustomButton>
      </div>
    </div>
  )
}

export default Start
