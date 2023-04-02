import { useState } from 'react'
import { CalendarStep } from './CalendarStep/index.page'
import { ConfirmStep } from './ConfirmStep'

export function ScheduleForm() {
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

    function handleClearSelectedDateTime() {
        setSelectedDateTime(null)
    }

    if (selectedDateTime) {
        return (
            <ConfirmStep
                onCancelConfirmation={handleClearSelectedDateTime}
                schedulingDate={selectedDateTime}
            />
        )
    }

    return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
