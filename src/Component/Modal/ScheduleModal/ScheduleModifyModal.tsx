import ModalSelectItem from '../ModalInputItem/ModalSelectItem'
import ModalTitle from '../ModalInputItem/ModalTitle'
import ModalTextInputItem from '../ModalInputItem/ModalTextInputItem'
import ModalContentContainer from '../ModalWrapper/ModalContentContainer'
import ModalButtonsContainer from '../ModalWrapper/ModalButtonsContainer'
import ModalButton from '../ModalInputItem/ModalButton'
import { useState, useRef } from 'react'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../../../store/hooks/storeHooks'
import { scheduleActions } from '../../../store/schedule'
import type { ModifySchedulePayload, Schedule } from '../../../store/schedule'
import type { ModalFunctionProps } from '../ModalWrapper/Modal'
import { useParams } from 'react-router-dom'

export default function ScheduleModifyModal({ ClickQuitHandler }: ModalFunctionProps) {
    const scheduleValue = useAppSelector(state => state.schedule)

    const dispatch = useAppDispatch()

    const { studyId }: { studyId: string } = useParams() as { studyId: string }

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule>()
    const [nameState, setNameState] = useState<string>('')
    const [locationState, setLocationState] = useState<string>('')
    const [dateState, setDateState] = useState<string>('')
    const [timeState, setTimeState] = useState<string>('')

    const nameRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)
    const dateRef = useRef<HTMLInputElement>(null)
    const timeRef = useRef<HTMLInputElement>(null)

    const ClickScheduleHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = e.target.value
        if (id !== 'none') {
            const selectedScheduleObj = scheduleValue.find(schedule => schedule.id === id)

            setSelectedSchedule(selectedScheduleObj)
            setNameState(selectedScheduleObj!.name)
            setDateState(selectedScheduleObj!.date)
            setLocationState(selectedScheduleObj!.location)
            setTimeState(selectedScheduleObj!.date)
        }
    }

    const ClickModifyScheduleHandler = async (): Promise<any> => {
        if (window.confirm('수정하시겠습니까?')) {
            const nameInput = nameRef.current
            const locationInput = locationRef.current
            const dateInput = dateRef.current
            const timeInput = timeRef.current

            const result = await axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/schedule/update`,
                data: {
                    id: selectedSchedule!.id,
                    name: nameInput!.value,
                    date: dateInput!.value,
                    location: locationInput!.value,
                    time: timeInput!.value
                }
            })

            if (result.data.result) {
                const modifySchedulePayload: ModifySchedulePayload = {
                    ...result.data.data
                }
                dispatch(scheduleActions.ModifySchedule(modifySchedulePayload))
            }

            setSelectedSchedule(undefined)
            ClickQuitHandler()
        }
    }

    return (
        <>
            <ModalContentContainer>
                <ModalTitle>수정</ModalTitle>
                <ModalSelectItem name={"일정"} onChange={ClickScheduleHandler}>
                    <option value={'none'}>선택</option>
                    {
                        scheduleValue.map(schedule => {
                            return (
                                <option key={schedule.id} value={schedule.id}>{schedule.name}</option>
                            )
                        })
                    }
                </ModalSelectItem>
                {
                    selectedSchedule ? (
                        <>
                            <ModalTextInputItem name="이름" ref={nameRef} onChangeHandler={(e: any): void => { setNameState(e.target.value) }} value={nameState} />
                            <ModalTextInputItem name="날짜" ref={dateRef} onChangeHandler={(e: any): void => { setDateState(e.target.value) }} value={dateState} />
                            <ModalTextInputItem name="시간" ref={timeRef} onChangeHandler={(e: any): void => { setTimeState(e.target.value) }} value={timeState} />
                            <ModalTextInputItem name="장소" ref={locationRef} onChangeHandler={(e: any): void => { setLocationState(e.target.value) }} value={locationState} />
                        </>
                    ) : null
                }
            </ModalContentContainer>
            <ModalButtonsContainer>
                <ModalButton onClick={ClickQuitHandler}>닫기</ModalButton>
                {
                    selectedSchedule ? <ModalButton onClick={ClickModifyScheduleHandler}>수정하기</ModalButton> : null
                }
            </ModalButtonsContainer>
        </>
    )
}