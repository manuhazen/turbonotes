import { humanizeDate } from "../utils"

describe("humanizeDate", () => {
    it("returns 'Today' for current date", () => {
        const today = new Date()
        expect(humanizeDate(today)).toBe("Today")
    })

    it("returns 'Yesterday' for previous date", () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        expect(humanizeDate(yesterday)).toBe("Yesterday")
    })

    it("returns formatted date for older dates", () => {
        // Use a fixed date to avoid timezone issues in testing if possible, 
        // but for relative checks simple Date is fine.
        const date = new Date("2023-01-01T12:00:00")
        expect(humanizeDate(date)).toBe("Jan 1, 2023")
    })
})
