import Td from "../../Table/Td"
import styled from "styled-components"
import axios from "axios"
import { memo } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../store/hooks/storeHooks"
import { attendanceActions } from "../../../store/attendance"
import { attendanceRateActions } from "../../../store/attendanceRate"
import type { Attendance } from "../../../store/attendance"
import type { CheckAttendancePayload } from "../../../store/attendance"
import type { CalculateAttendaceRatePayload } from "../../../store/attendanceRate"

const isEqual = (prev: Readonly<{ attendance: Attendance }>, next: Readonly<{ attendance: Attendance }>): boolean => {
    return prev.attendance.isAttended === next.attendance.isAttended;
};

export default memo(function AttendanceTableItem({ attendance }: { attendance: Attendance }) {
    const dispatch = useAppDispatch()

    const { studyId } = useParams()

    const AttendClickHandler = async (): Promise<any> => {
        const attendanceResult = await axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance/check`,
            data: {
                scheduleId: attendance.scheduleId,
                userId: attendance.userId,
                isAttended: attendance.isAttended
            }
        })

        const attendanceRateResult = await axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance-rate/calculate`,
            data: {
                userId: attendance.userId,
                studyId
            }
        })

        if (attendanceResult.data.result && attendanceRateResult.data.result) {
            const checkAttendancePayload: CheckAttendancePayload = {
                scheduleId: attendance.scheduleId,
                userId: attendance.userId
            }
            dispatch(attendanceActions.checkAttendance(checkAttendancePayload))

            const calculateAttendanceRatePayload: CalculateAttendaceRatePayload = {
                userAttendanceRate: attendanceRateResult.data.data
            }
            dispatch(attendanceRateActions.CalculateAttendanceRate(calculateAttendanceRatePayload))
        }
    }

    return (
        <Td key={attendance.userId}>
            <Item type="checkbox" onChange={AttendClickHandler} id={attendance.scheduleId + attendance.userId} checked={attendance.isAttended} />
            <label htmlFor={attendance.scheduleId + attendance.userId} />
        </Td>
    )
}, isEqual)
// export default function AttendanceTableItem({ attendance }: { attendance: Attendance }) {
//     const dispatch = useAppDispatch()

//     const { studyId } = useParams()

//     const AttendClickHandler = async (): Promise<any> => {
//         const attendanceResult = await axios({
//             method: 'PATCH',
//             url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance/check`,
//             data: {
//                 scheduleId: attendance.scheduleId,
//                 userId: attendance.userId,
//                 isAttended: attendance.isAttended
//             }
//         })

//         const attendanceRateResult = await axios({
//             method: 'PATCH',
//             url: `${process.env.REACT_APP_BASE_URL}/study/${studyId}/attendance-rate/calculate`,
//             data: {
//                 userId: attendance.userId,
//                 studyId
//             }
//         })

//         if (attendanceResult.data.result && attendanceRateResult.data.result) {
//             const checkAttendancePayload: CheckAttendancePayload = {
//                 scheduleId: attendance.scheduleId,
//                 userId: attendance.userId
//             }
//             dispatch(attendanceActions.checkAttendance(checkAttendancePayload))

//             const calculateAttendanceRatePayload: CalculateAttendaceRatePayload = {
//                 userAttendanceRate: attendanceRateResult.data.data
//             }
//             dispatch(attendanceRateActions.CalculateAttendanceRate(calculateAttendanceRatePayload))
//         }
//     }

//     return (
//         <Td key={attendance.userId}>
//             <Item type="checkbox" onChange={AttendClickHandler} id={attendance.scheduleId + attendance.userId} checked={attendance.isAttended} />
//             <label htmlFor={attendance.scheduleId + attendance.userId} />
//         </Td>
//     )
// }
const Item = styled.input`
    &{
        display: none;
      }
    & + label{
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border:3px solid #adacac;
        position: relative;
      }
    &:checked + label:after{
        content:'✔';
        font-size: 1.2rem;
        width: 1;
        height: 1.2rem;
        text-align: center;
        position: absolute;
        left: -1px;
        top: -10px;
        color: #4285f4;
        z-index: 2;
      }
`