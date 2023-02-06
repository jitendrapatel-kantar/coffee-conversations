import { formateDateTime } from "utils/utils";

test('required format date and time', () => {
    const{formatedDate, formatedTime} = formateDateTime('2023-02-05T21:21:07.666Z')

    expect(formatedDate).toBe('2023-02-05')
    expect(formatedTime).toBe('21:21')
})