import { faUser, faCheck, faBook } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components"
import { useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks/storeHooks';
import { shallowEqual } from "react-redux";

export default function UsersSummary() {
    const userValue = useAppSelector(state => state.user)
    const attendanceRateValue = useAppSelector(state => state.attendaceRate, shallowEqual)
    const submitRateValue = useAppSelector(state => state.submitRate, shallowEqual)

    const { studyId } = useParams()

    const navigate = useNavigate()

    // const totalAttendanceRate: string = useMemo(() => {
    //     const userLength: number = userValue.length
    //     const attendanceRateTotal: number = attendanceRateValue.reduce((accu, curr) => accu = accu + Number(curr.rate), 0)
    //     return (attendanceRateTotal / userLength).toFixed(1)
    // }, [attendanceRateValue, userValue])

    // const totalSubmitRate: string = useMemo(() => {
    //     const userLength: number = userValue.length
    //     const submitRateTotal: number = submitRateValue.reduce((accu, curr) => accu = accu + Number(curr.rate), 0)
    //     return (submitRateTotal / userLength).toFixed(1)
    // }, [submitRateValue, userValue])

    const userLength1: number = userValue.length
    const attendanceRateTotal: number = attendanceRateValue.reduce((accu, curr) => accu = accu + Number(curr.rate), 0)
    const totalAttendanceRate = (attendanceRateTotal / userLength1).toFixed(1)

    const userLength2: number = userValue.length
    const submitRateTotal: number = submitRateValue.reduce((accu, curr) => accu = accu + Number(curr.rate), 0)
    const totalSubmitRate: string = (submitRateTotal / userLength2).toFixed(1)


    return (
        <CardContainer>
            <Card onClick={() => { navigate(`/study/${studyId}/user`) }} $gridarea="1 / 1 / 2 / 3" >
                <FontAwesomeIcon icon={faUser} size="2xl" />
                <div>
                    <p>{userValue.length}</p>
                    <h3>전체 회원</h3>
                </div>
            </Card>
            <Card onClick={() => { navigate(`/study/${studyId}/schedule`) }} $gridarea="2 / 1 / 3 / 2" >
                <FontAwesomeIcon icon={faCheck} size="xl" />
                <div>
                    <p>{totalAttendanceRate !== 'NaN' ? totalAttendanceRate : 0}%</p>
                    <h3>전체 출석률</h3>
                </div>
            </Card>
            <Card onClick={() => { navigate(`/study/${studyId}/assignment`) }} $gridarea="2 / 2 / 3 / 3" >
                <FontAwesomeIcon icon={faBook} size="xl" />
                <div>
                    <p>{totalSubmitRate !== 'NaN' ? totalSubmitRate : 0}%</p>
                    <h3>전체 과제 제출률</h3>
                </div>
            </Card>
        </CardContainer>
    )
}

// styled-component props
interface CardProps {
    $gridarea: string;
}

const CardContainer = styled.section`
    display: grid;
    height: 250px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    margin-bottom: 2rem;
`

const Card = styled.div<CardProps>`
    grid-area: ${props => props.$gridarea};
    padding: 15px;
    background-color: #282828;
    color: white;
    display: flex;
    align-items: center;
    gap: 13px;
    cursor: pointer;
`