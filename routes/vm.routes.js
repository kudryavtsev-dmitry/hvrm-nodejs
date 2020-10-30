const { Router } = require('express')
const { execSync, spawn, spawnSync } = require('child_process')
const iconv = require('iconv-lite')

const router = Router()

router.get('/', async (req, res) => {
  try {
    console.log('working')

    const vmdata = execSync(
      'powershell.exe -command "(Get-VM |select Name , State, CPUUsage, MemoryAssigned, Uptime, Status , Version| ConvertTo-Json     )"',
    )
    res.status(200).send(iconv.decode(vmdata, 'CP866'))
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

module.exports = router
