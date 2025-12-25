import { flatten } from 'lodash'
import { startOfDay } from 'date-fns'
import { Dataset, Record } from '@/types'

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

export const flat = (dataset: Dataset) => {
  if (dataset)
    return flatten(Object.values(dataset))
  else
    return []
}
