type button = {
    text: string
    icon?: string
    role?: string
}

export interface NotificationToast {
    message: string
    position: "top" | "bottom"
    duration?: number
    buttons?: Array<button>
}
