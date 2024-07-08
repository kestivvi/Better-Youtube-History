import { Center, Flex, Text } from '@mantine/core'
import { signal } from '@preact/signals-react'
import FirstStage from './FirstStage'
import Create from './Create'
import UseExisting from './UseExisting'
import { useSignals } from '@preact/signals-react/runtime'

export const setCalendarViewStage = signal<'FIRST_STAGE' | 'CREATE' | 'USE_EXISTING'>('FIRST_STAGE')

export default function () {
  useSignals()

  return (
    <>
      <Center>
        <Text
          fw={900}
          variant="gradient"
          gradient={{ from: 'red', to: 'yellow', deg: 60 }}
          style={{
            fontSize: 25,
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          Better Youtube History
        </Text>
      </Center>
      <Flex
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {setCalendarViewStage.value === 'FIRST_STAGE' && <FirstStage />}
        {setCalendarViewStage.value === 'CREATE' && <Create />}
        {setCalendarViewStage.value === 'USE_EXISTING' && <UseExisting />}
      </Flex>
    </>
  )
}
