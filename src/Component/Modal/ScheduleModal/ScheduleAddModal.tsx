import ModalTextInputItem from "../ModalInputItem/ModalTextInputItem"
import ModalTitle from "../ModalInputItem/ModalTitle"
import ModalContentContainer from "../ModalWrapper/ModalContentContainer"
import ModalButtonsContainer from "../ModalWrapper/ModalButtonsContainer"
import ModalButton from "../ModalInputItem/ModalButton"
import { useRef } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useParams } from "react-router-dom"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "../../../store/hooks/storeHooks"
import { scheduleActions } from "../../../store/schedule"
import { attendanceActions } from "../../../store/attendance"
import { attendanceRateActions } from "../../../store/attendanceRate"
import type { ModalFunctionProps } from '../ModalWrapper/Modal'
import type { AddSchedulePayload } from "../../../store/schedule"
import type { AddAttendanceByschedulePayload } from "../../../store/attendance"
import type { CalculateAllAttendanceRatePayload } from "../../../store/attendanceRate"

export default function ScheduleAddModal({ ClickQuitHandler }: ModalFunctionProps) {
    const userValue = useAppSelector(state => state.user)

    const dispatch = useAppDispatch()

    const { studyId }: { studyId: string } = useParams() as { studyId: string }

    const nameRef = useRef<HTMLInputElement>(null)
    const dateRef = useRef<HTMLInputElement>(null)
    const timeRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)

    const ClickAddScheduleHandler = async (): Promise<any> => {
        const inputname = nameRef.current
        const inputDate = dateRef.current
        const inputTime = timeRef.current
        const inputLocation = locationRef.current
        const id = uuidv4()

        const scheduleResult = await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/schedule/add`,
            data: {
                id,
                name: inputname!.value.trim(),
                date: inputDate!.value.trim(),
                time: inputTime!.value.trim(),
                location: inputLocation!.value.trim(),
                studyId
            }
        })

        const attendanceResult = await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance/add-schedule`,
            data: {
                users: userValue,
                scheduleId: id,
                studyId
            }
        })

        const attendanceRateResult = await axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance-rate/calculate-all`,
            data: {
                studyId
            }
        })

        const addSchedulePayload: AddSchedulePayload = {
            ...scheduleResult.data.data
        }
        dispatch(scheduleActions.AddSchedule(addSchedulePayload))

        const addAttendancePayload: AddAttendanceByschedulePayload = {
            attendances: attendanceResult.data.data
        }
        dispatch(attendanceActions.AddAttendance(addAttendancePayload))

        const calculateAttendanceRatePayload: CalculateAllAttendanceRatePayload = {
            attendanceRates: attendanceRateResult.data.data
        }
        dispatch(attendanceRateActions.CalculateAllAttendanceRate(calculateAttendanceRatePayload))

        ClickQuitHandler()
    }

    return (
        <>
            <ModalContentContainer>
                <ModalTitle>추가</ModalTitle>

                <ModalTextInputItem name={'이름'} ref={nameRef} />
                <ModalTextInputItem name={'날짜'} ref={dateRef} />
                <ModalTextInputItem name={'시간'} ref={timeRef} />
                <ModalTextInputItem name={'장소'} ref={locationRef} />
            </ModalContentContainer>

            <ModalButtonsContainer>
                <ModalButton onClick={ClickAddScheduleHandler}>추가</ModalButton>
                <ModalButton onClick={ClickQuitHandler}>닫기</ModalButton>
            </ModalButtonsContainer>
        </>
    )
}