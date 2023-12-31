import { memo } from "react"
import TableWrapper from "../../Table/TableWrapper"
import Table from "../../Table/Table"
import TableHead from "../../Table/TableHead"
import Talbebody from "../../Table/TableBody"
import Th from "../../Table/Th"
import Td from "../../Table/Td"
import AttendanceTableItem from "./AttendanceTableItem"
import { useAppSelector } from "../../../store/hooks/storeHooks"
import { DateFormater } from "../../../utils/utils"
import type { Attendance } from "../../../store/attendance"

// export default memo(function AttendanceTable() {
//     const userValue = useAppSelector(state => state.user)
//     const scheduleValue = useAppSelector(state => state.schedule)
//     const attendanceValue = useAppSelector(state => state.attendance)

//     /**
//      * 스케쥴의 id와 과제의 스케쥴 id가 동일 할 경우에만 tableItem 반환하는 함수
//      * @param SscheduleId 
//      * @param AscheduleId 
//      * @param attendance 
//      * @returns 
//      */
//     const MatchedTableItem = (SscheduleId: string, AscheduleId: string, attendance: Attendance): (JSX.Element | null | undefined) => {
//         switch (SscheduleId === AscheduleId) {
//             case true:
//                 return <AttendanceTableItem attendance={attendance} key={attendance.scheduleId + attendance.userId} />
//             case false:
//                 return null
//         }

//     }
//     return (
//         <TableWrapper height="90%">
//             <Table>
//                 <TableHead>
//                     <Th className="pin">ㅤ</Th>
//                     {
//                         userValue.length === 0 ? (
//                             <>
//                                 <Th>회원을 추가해 주세요</Th>
//                             </>
//                         ) : (
//                             <>
//                                 {
//                                     userValue.map(user => {
//                                         return (
//                                             <Th key={user.id}>{user.name}</Th>
//                                         )
//                                     })
//                                 }
//                             </>
//                         )
//                     }
//                 </TableHead>
//                 <Talbebody>
//                     {
//                         scheduleValue.length === 0 ? (
//                             <tr>
//                                 <Th>일정을 추가해 주세요</Th>
//                                 <Td></Td>

//                             </tr>
//                         ) : (
//                             <>
//                                 {
//                                     scheduleValue.slice(0).reverse().map(schedule => {
//                                         return (
//                                             <tr key={schedule.id}>
//                                                 <Th>{DateFormater('yyyy년 MM월 DD일', schedule.date)}</Th>
//                                                 {
//                                                     attendanceValue.map(attendance =>
//                                                         MatchedTableItem(schedule.id, attendance.scheduleId, attendance)
//                                                     )
//                                                 }
//                                             </tr>
//                                         )
//                                     })
//                                 }
//                             </>
//                         )
//                     }
//                 </Talbebody>
//             </Table>
//         </TableWrapper>
//     )
// })
export default function AttendanceTable() {
    const userValue = useAppSelector(state => state.user)
    const scheduleValue = useAppSelector(state => state.schedule)
    const attendanceValue = useAppSelector(state => state.attendance)

    /**
     * 스케쥴의 id와 과제의 스케쥴 id가 동일 할 경우에만 tableItem 반환하는 함수
     * @param SscheduleId
     * @param AscheduleId
     * @param attendance
     * @returns
     */
    const MatchedTableItem = (SscheduleId: string, AscheduleId: string, attendance: Attendance): (JSX.Element | null | undefined) => {
        switch (SscheduleId === AscheduleId) {
            case true:
                return <AttendanceTableItem attendance={attendance} key={attendance.scheduleId + attendance.userId} />
            case false:
                return null
        }

    }
    return (
        <TableWrapper height="90%">
            <Table>
                <TableHead>
                    <Th className="pin">ㅤ</Th>
                    {
                        userValue.length === 0 ? (
                            <>
                                <Th>회원을 추가해 주세요</Th>
                            </>
                        ) : (
                            <>
                                {
                                    userValue.map(user => {
                                        return (
                                            <Th key={user.id}>{user.name}</Th>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </TableHead>
                <Talbebody>
                    {
                        scheduleValue.length === 0 ? (
                            <tr>
                                <Th>일정을 추가해 주세요</Th>
                                <Td></Td>

                            </tr>
                        ) : (
                            <>
                                {
                                    scheduleValue.slice(0).reverse().map(schedule => {
                                        return (
                                            <tr key={schedule.id}>
                                                <Th>{DateFormater('yyyy년 MM월 DD일', schedule.date)}</Th>
                                                {
                                                    attendanceValue.map(attendance =>
                                                        MatchedTableItem(schedule.id, attendance.scheduleId, attendance)
                                                    )
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </Talbebody>
            </Table>
        </TableWrapper>
    )
}