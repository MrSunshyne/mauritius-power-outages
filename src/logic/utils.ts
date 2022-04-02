import { Dataset, Record } from '@/types'
import { flatten } from 'lodash';
import { startOfDay } from 'date-fns'

export const filterByToday = (dataset: Record[]) => {
  let x = startOfDay(new Date()).getTime();

  return dataset.filter(record => {
    let startOfThatDay = startOfDay(new Date(record.from)).getTime();
    return x === startOfThatDay
  })

}

export const filterByAfterToday = (dataset: Record[]) => {
  let x = startOfDay(new Date()).getTime();

  return dataset.filter(record => {
    let startOfThatDay = startOfDay(new Date(record.from)).getTime();
    return startOfThatDay > x
  })

}

export const flat = (dataset: Dataset) => {
  return flatten(Object.values(dataset))
}

