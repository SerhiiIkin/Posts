import { useMessageStore } from "../store/store";

function Message() {
    const {message} = useMessageStore()

    return (
        <>
            {message && (
                <div className="fixed bottom-2 right-2 p-2 border rounded-xl bg-gray-400 text-blue-500">
                    {message}
                </div>
            )}
        </>
    );
}

export default Message;
