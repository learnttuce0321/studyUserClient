import ModalSelectItem from "../ModalInputItem/ModalSelectItem";
import ModalTitle from "../ModalInputItem/ModalTitle";
import ModalContentContainer from "../ModalWrapper/ModalContentContainer";
import ModalTextInputItem from "../ModalInputItem/ModalTextInputItem";
import ModalButtonsContainer from "../ModalWrapper/ModalButtonsContainer";
import ModalButton from "../ModalInputItem/ModalButton";
import { useRef, useState } from "react";
import { uniqBy } from "lodash";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/storeHooks";
import { DateFormater } from "../../../utils/utils";
import { fineActions } from "../../../store/fine";
import type { Fine, ModifyFinePayload } from "../../../store/fine";
import type { User } from "../../../store/user";
import type { ModalFunctionProps } from "../ModalWrapper/Modal";

export default function FineModifyModal({ ClickQuitHandler }: ModalFunctionProps) {
    const userValue = useAppSelector(state => state.user)
    const fineValue = useAppSelector(state => state.fine)

    const dispatch = useAppDispatch()

    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [selectedFineId, setSelectedFineId] = useState<string>('')
    const [selectedFineObj, setSelectedFineObj] = useState<Fine | undefined>()
    const [fineState, setFineState] = useState<number>()
    const [deadLineState, setDeadLineState] = useState<string>('')

    const hasFineUsers: any = GetHasFineUsers(fineValue, userValue)
    const userFines: Array<Fine> = GetUserFine(fineValue, selectedUserId)

    const fineRef = useRef<HTMLInputElement>(null)
    const deadLineRef = useRef<HTMLInputElement>(null)

    const ClickuserIdHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedUserId(e.target!.value)
    }

    const ClickFineIdHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        let matchedFineObj = fineValue.find(fine => fine.id === e.target!.value)

        setSelectedFineId(e.target!.value)
        setSelectedFineObj(matchedFineObj)
        setFineState(matchedFineObj!.fine)
        setDeadLineState(matchedFineObj!.deadLine)
    }

    const ClickModifyHandler = async (): Promise<any> => {
        if (window.confirm('수정하시겠습니까?')) {
            const fineInput = fineRef.current
            const deadLineInput = deadLineRef.current

            const result = await axios({
                method: 'PATCH',
                url: '${process.env.REACT_APP_BASE_URL}/fine/update',
                data: {
                    id: selectedFineId,
                    deadLine: deadLineInput!.value,
                    fine: parseInt(fineInput!.value)
                }
            })

            if (result.data.result) {
                const modifyFinePayload: ModifyFinePayload = {
                    id: selectedFineId,
                    deadLine: deadLineInput!.value,
                    fine: parseInt(fineInput!.value)
                }
                dispatch(fineActions.ModifyFine(modifyFinePayload))
            }
        }
        ClickQuitHandler()
    }

    return (
        <>
            <ModalContentContainer>
                <ModalTitle>벌금 내역 수정</ModalTitle>
                <ModalSelectItem name={"이름"} onChange={ClickuserIdHandler}>
                    <option value={''}>선택</option>
                    {
                        uniqBy(hasFineUsers, 'userId').map((fine: any) => <option key={fine.userId} value={fine.userId}>{fine.name}</option>)
                    }
                </ModalSelectItem>
                {
                    selectedUserId.trim().length ? (
                        <ModalSelectItem name={"기한"} onChange={ClickFineIdHandler}>
                            <option value={''}>선택</option>
                            {
                                userFines.map(userFine => <option key={userFine.id} value={userFine.id}>{DateFormater('yyyy년 MM월 DD일', userFine.deadLine)}</option>)
                            }
                        </ModalSelectItem>
                    ) : null
                }
                {
                    selectedFineObj ? (
                        <>
                            <ModalTextInputItem name="벌금" ref={fineRef} onChangeHandler={(e: any): void => { setFineState(e.target.value) }} value={fineState!.toString()} />
                            <ModalTextInputItem name="기한" ref={deadLineRef} onChangeHandler={(e: any): void => { setDeadLineState(e.target.value) }} value={deadLineState} />
                        </>
                    ) : null
                }
            </ModalContentContainer>

            <ModalButtonsContainer>
                <ModalButton onClick={ClickQuitHandler}>닫기</ModalButton>
                <ModalButton onClick={ClickModifyHandler}>수정하기</ModalButton>
            </ModalButtonsContainer>
        </>
    )
}
const GetHasFineUsers = (fineValue: Array<Fine>, userValue: Array<User>): any => {
    const returnValue: any = fineValue.map(fine => {
        const matchedUserObj = userValue.find(user => user.id === fine.userId)
        return { ...fine, name: matchedUserObj!.name }
    })
    return returnValue
}

const GetUserFine = (fineValue: Array<Fine>, userId: string): Array<Fine> => {
    return fineValue.filter(fine => fine.userId === userId)
}
