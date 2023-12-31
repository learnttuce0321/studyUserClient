import Td from "../../Table/Td";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/storeHooks";
import { DateFormater } from "../../../utils/utils";
import { clickedMessageActions, type SetClickedMessagePayload } from "../../../store/clickedMessage";
import { ModalState, modalActions } from "../../../store/modal";
import type { Message } from "../../../store/message";
import type { User } from "../../../store/user";

export default function MessageTableItem({ message, index, length }: { message: Message, index: number, length: number }) {
    const userValue = useAppSelector(state => state.user)
    const messageValue = useAppSelector(state => state.message)

    const dispatch = useAppDispatch()

    const matchedUserObj: (User | undefined) = useMemo(() => {
        return userValue.find(user => user.id === message.userId)
    }, [message, userValue])

    const ClickMessageHandler = (e: any): void => {
        const clickedMessageId: string = e.currentTarget.id
        const payload: SetClickedMessagePayload = {
            message: messageValue.find(message => message.id === clickedMessageId)
        }
        dispatch(clickedMessageActions.setClickedMessage(payload))
        dispatch(modalActions.setModalState({ type: ModalState.CHECK_MESSAGE }))
    }

    return (
        <tr id={message.id} onClick={ClickMessageHandler}>
            <Td>{length - index}</Td>
            <Td>{message.content.length > 6 ? message.content.slice(0, 6) + '...' : message.content}</Td>
            <Td>{matchedUserObj!.name}</Td>
            <Td>{DateFormater('yyyy년 MM월 DD일', message.date)}</Td>
            <Td>{message.time}</Td>
        </tr>
    )
}