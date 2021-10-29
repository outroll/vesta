export const values = (select = {}) => {
  return {
    usersList: [
      { value: 'rebuild', name: select.rebuild },
      { value: 'rebuild web', name: select['rebuild web'] },
      { value: 'rebuild dns', name: select['rebuild dns'] },
      { value: 'rebuild mail', name: select['rebuild mail'] },
      { value: 'rebuild db', name: select['rebuild db'] },
      { value: 'rebuild cron', name: select['rebuild cron'] },
      { value: 'update counters', name: select['update counters'] },
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    webList: [
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    dnsList: [
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    mailList: [
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    dbList: [
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    cronList: [
      { value: 'add-cron-reports', name: select['turn on notifications'] },
      { value: 'delete-cron-reports', name: select['turn off notifications'] },
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    backupList: [
      { value: 'delete', name: select.delete }
    ],
    packagesList: [
      { value: 'delete', name: select.delete }
    ],
    internetProtocolsList: [
      { value: 'reread IP', name: select['reread IP'] },
      { value: 'delete', name: select.delete }
    ],
    updatesList: [
      { value: 'update', name: select.update }
    ],
    firewallList: [
      { value: 'suspend', name: select.suspend },
      { value: 'unsuspend', name: select.unsuspend },
      { value: 'delete', name: select.delete }
    ],
    serverList: [
      { value: 'stop', name: select.stop },
      { value: 'start', name: select.start },
      { value: 'restart', name: select.restart }
    ],
    backupDetailList: [
      { value: 'restore', name: select.restore }
    ],
    banList: [
      { value: 'delete', name: select.delete }
    ]
  }
};