import { startOfDay } from 'date-fns'
import type { Dataset, Record } from '~/types'

export const filterByToday = (dataset: Record[]) => {
  const x = startOfDay(new Date()).getTime()

  return dataset.filter((record) => {
    const startOfThatDay = startOfDay(new Date(record.from)).getTime()
    return x === startOfThatDay
  })
}

export const filterByAfterToday = (dataset: Record[]) => {
  const x = startOfDay(new Date()).getTime()

  return dataset.filter((record) => {
    const startOfThatDay = startOfDay(new Date(record.from)).getTime()
    return startOfThatDay > x
  })
}

export const filterByBeforeToday = (dataset: Record[]) => {
  const x = startOfDay(new Date()).getTime()

  return dataset.filter((record) => {
    const startOfThatDay = startOfDay(new Date(record.from)).getTime()
    return x > startOfThatDay
  })
}

export const filterByDate = (dataset: Record[], date: Date) => {
  const x = startOfDay(date).getTime()

  return dataset.filter((record) => {
    const startOfThatDay = startOfDay(new Date(record.from)).getTime()
    return x === startOfThatDay
  })
}

export const flat = (dataset: Dataset | null | undefined): Record[] => {
  if (dataset)
    return Object.values(dataset).flat()
  return []
}
