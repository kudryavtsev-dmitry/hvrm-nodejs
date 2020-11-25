const { Router } = require('express')
const { execSync } = require('child_process')

const router = Router()

router.get('/memory', async (req, res) => {
  try {
    const memory = execSync(
      `powershell.exe -command "(Get-ComputerInfo | select @{Name = 'free'; Expression={$_.OsFreePhysicalMemory/1024}},@{Name = 'total'; Expression={$_.OsTotalVisibleMemorySize/1024}} | ConvertTo-Json )"`,
    )

    res.status(200).send(memory)
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' })
  }
})

module.exports = router
