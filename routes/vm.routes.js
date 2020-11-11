const { Router } = require('express')
const { execSync } = require('child_process')
const iconv = require('iconv-lite')

const router = Router()


const getVMData = (res) =>{
  const vmdata = execSync(
    'powershell.exe -command "(Get-VM |select Name , State, CPUUsage, MemoryAssigned, Uptime, Status , Version| ConvertTo-Json     )"',
  )

  const machines = iconv.decode(vmdata, 'CP866')

  if(!Array.isArray(JSON.parse(machines))){
    const machine = [JSON.parse(machines)]
    console.log(JSON.parse(machines))
    return   res.status(200).json(machine)
  }
  res.status(200).send(machines)
}

updateVM = (res , name) =>{
  const selectedVM = execSync(`powershell.exe -command "(Get-VM -Name '${name}'|  select Name , State, CPUUsage, MemoryAssigned, Uptime, Status , Version| ConvertTo-Json)"`)

  const machine = iconv.decode(selectedVM, 'CP866')

  res.status(200).send(machine)
}
router.get('/', async (req, res) => {
  try {
    console.log('req')
   getVMData(res)
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/start', async (req, res) => {
  try {
    const {name} = req.body

    execSync(`powershell.exe -command "(Start-VM -Name '${name}'    )"`)

    updateVM(res,name)

    // getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/stop', async (req, res) => {
  try {
    const {name} = req.body

    execSync(`powershell.exe -command "(Stop-VM -Name '${name}' -TurnOff)"`)

    getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})
router.post('/suspend', async (req, res) => {
  try {
    const {name} = req.body


    execSync(`powershell.exe -command "(Suspend-VM -Name '${name}')"`)

    getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/resume', async (req, res) => {
  try {
    const {name} = req.body


    execSync(`powershell.exe -command "(Resume-VM -Name '${name}')"`)

    getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/save', async (req, res) => {
  try {
    const {name} = req.body


    execSync(`powershell.exe -command "(Save-VM -Name '${name}')"`)

    getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/shutdown', async (req, res) => {
  try {
    const {name} = req.body

    execSync(`powershell.exe -command "(Stop-VM -Name '${name}' -Force)"`)

    getVMData(res)
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/restart', async (req, res) => {
  try {
    const {name} = req.body

    execSync(`powershell.exe -command "(Restart-VM -Name '${name}')"`)

    getVMData(res)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

router.post('/update', async (req, res) => {
  try {
    const {name} = req.body

   const selectedVM = execSync(`powershell.exe -command "(Get-VM -Name '${name}'|  select Name , State, CPUUsage, MemoryAssigned, Uptime, Status , Version| ConvertTo-Json)"`)

    const machine = iconv.decode(selectedVM, 'CP866')

    console.log(machine)

    res.status(200).send(machine)

  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

module.exports = router