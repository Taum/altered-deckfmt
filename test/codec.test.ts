import {
  describe,
  expect,
  it,
  test,
} from 'vitest'
import { encodeList, decodeList } from '../src'
import * as fs from 'fs'
import { RefSetCode } from '../src/models'

const files = [
  "test/decklists/test_mana_orb.txt",
  "test/decklists/test_long_uniq.txt",
  "test/decklists/test_extd_qty.txt",
  "test/decklists/test_products.txt",
  "test/decklists/test_alize_1.txt",
  "test/decklists/test_alize_2.txt",
  "test/decklists/test_alize_neutrals.txt",
  "test/decklists/test_bise_1.txt",
  "test/decklists/test_bise_2.txt",
  "test/decklists/list_1offs.txt",
  "test/decklists/list_2sets.txt",
  "test/decklists/list_uniques.txt",
  "test/decklists/list_yzmir.txt",
  "test/decklists/test_collection.txt",
  "test/decklists/test_all_sets.txt",
  "test/decklists/list_exalts.txt",
] as const
const expectedEncoded = {
  "test/decklists/test_mana_orb.txt": "EBAg3gjtwvBA",
  "test/decklists/test_long_uniq.txt": "EBARGx8E0mx8nD2x8wOWx___wA",
  "test/decklists/test_extd_qty.txt": "EBAgTTGU",
  "test/decklists/test_products.txt": "EBAg04I1kySagA",
  "test/decklists/test_alize_1.txt": "EBAw3bR21djwTSA",
  "test/decklists/test_alize_2.txt": "ECAwm4xsMAgmwz5O",
  "test/decklists/test_alize_neutrals.txt": "ECAgXwQDCfBHwgA",
  "test/decklists/test_bise_1.txt": "EBAw3bR21djwTSA",
  "test/decklists/test_bise_2.txt": "EEBBHAJ4zAJZpON8CNwELw88QAIGxFAwXJk",
  "test/decklists/list_1offs.txt": "ECAU2QxkhZIKRyk0pFWSlkRZGGSxk5pQLC5lIdRqVhlhpeGXkCLpOGS1o6ZQaURlZZYKXRt6ZZGWUA",
  "test/decklists/list_2sets.txt": "ECAjGgzoh6KOizpA6RalHpkaaKmnpw6eQESlq6FKjjo8",
  "test/decklists/list_uniques.txt": "EBAVnAxwR8GHCVwk8ILCmww8PKT6xRsTPFhoXDhxk_EShxxabqnaxkcbfGC1yA",
  "test/decklists/list_yzmir.txt": "EBAk3gzpCuEPh1oqcIvhi4seMPjjpm-TGnLxm-VPli5geaHmQA",
  "test/decklists/test_collection.txt": "EWA_1GMUY0CkEA5DOYBmBA5hAGYimJ5jAGZCmRZkwVIA5lGZUFmYZmWZsAFWZsQ0AKZxmdBZoKaEDmkZpQaahmpCZrGa0CmwZsQKbRm1CJuKblqGakmq5qyaum35uScinIsSDXYa6CegyqeetgHrqSlFKVVI6WkmYroEA6DASoABqBBKhGoXqIaiQWowD_ajWo8NygKpCqRCqlKpUCqYamWpsIsAKpyqd6oGqEFqkqpQSqjqpAqrKq0CqwB6tGrUGq4quW4ZuHFSpuycjrJKyWsmrKJyjFaaym8svZ726-jnpJ6iUpYBTiGarqKqjupZqXJ-UGsIBbDAa3yt9bfxyMArgAW4RuFAbiO4kJuMrjQW5CuRBLlK5UD_BrmO5nucbnQK6CuhArpAW6jup7rG60Iuw7tLIayqsrnLa2Sdkwnldonoq6WVIxmCZmmaamyZumppqbHvBqibjm5cZXwPAgGwMB8fHH1x_R4QCyAcgQHISyF8iHIlyLK-QEyMcjQTJACyUslQPJgEyccnxfzA8oHKEHykcpQLKiypAcrHK0KywssQP8Dy0stXY72Wdl0dPenlWYVZmmeZnx1mpomoMX_wKqquabpm6px-cgnIMXcHJ4B0EAdDALYR2HGZoF2ItiQPYy2NBtkHZED2UdlQTZi2ZA9nLZ0D2gdoQTaR2lA9qHakG2strQbbB2xA9tLbUE24duQPbz29uhnpp6meslGOlpBmGZjmY8XcaZZmuA4GqZuCbim552admwiyBOBATgwG6AegQToS6FAuiLokD6Mej2mGA-kHpEF6UelQPpgC6cA-oATqQB6ouqQTqwB6tAusATrQG64euQT_kEUgylicsilmMs2loMtSlsMtllucuTl0Uuyl4MvRl60vil-Mv2pjNNatpOtp5tPOplrNAypiVMUBpkVMxpm9NBpqVNhpuNOBpyNOip2dPDp6NPhp8tPxp-ttZx7WuJ5xPOZl7ANgQBsGVsRtkNsltmVs3toVtFtqAn9bYbbjbg7cjbo7dnbwbePb0rfDb8cczj-aZzbOcAjgM8YjjIcZNjMcZ5Qf-NCxqONhxsuNyxwOORxy-OgBx2OPBx42PRx62Phx-OtJlnOOMBP7QR6xHWQ6ybWZa0HWo61fWw62XW564HXD65HXQ66XXZa8LXo6-LX483gR153MuJp_Nt5t_OtZ1vXAR4GPMS5kfMy5oXNR5s_Nx5u_OB5wvOR5y3Oh52PO254fPR56vPh5-AX4DIICSEUhgFIgyIsiYxncijIryMMjIHI4yOsj4BLUkAFJIyS8lDJSByWMl4s40mDJiyZjBWAyaMmrJuM7AFJwycsnY6U0nlKBSg8ojKLykUpLKWOOYHKYymsp4C-8qFKiBSqUrHKzSuMroFLBSwgUsgDLQBS2UtvLgAy6AMvHLy0fViVZU2bNo3acBf9vTg84ZOGYvXOG1js6POk1rU8LPEYJNPEYyPvFYb-5IYpNCk0soTKGMq7LUA0CANBADQYBUIVCIFQpUKglDDQ2FawDQ40O9EFRCBUSAVFHRT0WNFoHRg0ZjQb0aAdHHRz0edHoFSBUg1InSKA0kVJNSZUm1KFSj0qAVLFSy0thTOBUudMAHTJ00AdNgF_04AVOlTqBU8NPNY02Nhxm2NjDLWTNmY2mtpTaWLb1a84fOH4T2eJXit49elzp08NPEzyF8lPJYdSRQQyTMqTSc0vANMQLYIBWEANhnYgBWKNioHYxWMgdjjY6C2QVkILZI2SgNlFZSC2WVloJZg2YglmjZqBWcNnYa_dnjZ62fgQeCWgAVolaKBWkNpIF_2mVpoFahWogVqnaxWuNroFbA2wglslbKBW0VtIDbY22gNuAHbo26gNvHbzYTOFXiE4pOKYtSWiTqs8JfD1xs8dPJ3ys8tXM1ztFhCk1UiXI0ydUnzKcytMszQs0NNF4kfVNTTc07Vi3Zd2dNqza02xduwLgIA4EOBgDggBfuCLgmIhgNgo4KgWDDgy4NjMC4NjUp4OeDoFhBYQgWEnhKBYUOFIJhZYWgmGDhiBYaWGoJhw4cg-Hlh6B4geIPiI4jjQbYkWJPiYA4oOKIJio4q-LFiy4tghf4uOLoDjBYwgmMljKB40ONILjZY2gmOFjiBY6WOoDjw48umzq9a5JgZSLUjzJUBfslzK9SxMtzLk0JNEzSM0peJzjF43eggDoQBaGWiFoiB6KOioHow6Mg2jjo7aQOkIDpIA6UeljpaA6YAmmjpqA6cenILp5ae-oDqCBaiOorqOB04HqQA6mAWqDqj6qerDqyCauWroJrAD6yOstrRa0gWtjraDa4WuIDro66g2vDxcBf3Hzylc5JoQybNITTM2PVkTbk4ROM1o06NjEq6VOoVqd6pOtwDwIA8EPBgDwg8IvCYf7fCnwwB8OfDoFxA8QgPElxL8UPFIHxYA8YAvGgDxx8ePIADyIBckfJIHyY8ofKPypcqgPLAFy48wPMIDzI8y_NAFzZc4POPzpc6_PFzyBAxwQA_0ggDIRSGUiDIjSKMitIxyOUkFJIyS8lDJTSWMmDJjyaUnFJ5ygUojKLykUplKbSoMqlKrSsUrlLBSyMstLRS2MtrLgy4gMujLrUPNHzZU2bVoXhc4ZOjzqM6jgs46xPFTzUyRMu3QJUEVBlQhUKVDDQyA_1DnRBUSVFFRY0W1GFRo0a1HFR5UgNINSJUkNJjSbUoNKPSo0q1LHS5UwNMLTGKG7TI00VNNTY02tODTjU6VPDTzWZNqYSetr1bM4Lg8C4fOI1iU4rONTpc8NPITJMyjMqTRs0nNL1YJWENhlYhWKNitYx2OAP7Y7WQVkjZLWUNlNZZWYNmNZo2biIDWcdnjZ62gVojaK2jhog2kNpNaY2odqgDaxWuNrtbA2w1snbQ20ttlbbW4NuNbo26tvDhM4VOHTik6JOq4QtvD3yd8zPOzz0ytNCzQ001NNzYs2rVrXgJ4EeBlgg4I2CgD-4MWDNg5YQOENhI4S2FHhY4WuF4gUOGDhjYaWHFh5YgeIjiLYkOJPiY4m2KFio4sOLPi44u-MFjI4y2NFjZ44OOjjr48WPLqUyPMpTLEy5NI1Ss4nOMTjdaCehFoY6IWilowA6OOjtpBaSelDpY6W-mAD_6aOmrpuA7Fpw6c2nlqBaiWpDqTamOptqg6qWrFq46uusDrI6y2tDrTa2Ottrh66Ouvrw68vGTzE83NjzZE25OCTgmAnFjM6LOkTqE6nOqVwIA8EXBlwhcKPDFw5cQPELxJcUPFNxY8WvGDxo8a3HHx5cgAK7yDcifJDyS8mXKDyj8qPKtyxcuXMFzI8y_NDzTc2PNtzg84vOjzrc8A",
  "test/decklists/test_all_sets.txt": "ESAgqTio6AQqRWwuAwm4xsMBAgJZpON8CNwUKJ1Ur1BgstTmQQcJJCJwgIC5gl1ACQ-aopxJ7KAoLJUMUmAsLKsiKxQMC6PiRxENC97mlaA4KR1BT6wPBTYEQCqlFlkBEFJCBIKKxRJAgA",
  "test/decklists/list_exalts.txt": "ECCw0rFE3DE69AkdSxRrFHMEdwxVwx69Fa9A"
}

function splitTrimSort(text: string): Array<string> {
  return text.split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .sort()
}

function expectEqualLists(actual: string, expected: string) {
  const actualArr = splitTrimSort(actual)
  const expectedArr = splitTrimSort(expected)
  expect(actualArr).toEqual(expectedArr)
}

describe('file-based tests', () => {
  test.for(files)("With file '%s'", (fileName) => {
    const content = fs.readFileSync(fileName, { encoding: 'utf8' })
    // Compare encoding results
    const encoded = encodeList(content)
    expect(encoded).toEqual(expectedEncoded[fileName])
    // Compare decoding results
    const decoded = decodeList(encoded)
    expectEqualLists(decoded, content)
  })
})

describe('validate test suite', () => {
  it('should throw an error if there\'s a set not being tested', () => {
    const content = fs.readFileSync("test/decklists/test_all_sets.txt", { encoding: 'utf8' })
    const setReferences = Object.values(RefSetCode)
    const missing = setReferences.filter(v => !content.includes(v))
    expect(missing, "sets without tests").toEqual([])
  })
})

describe('encoding validations', () => {
  it('should throw an error when trying to encode uniques beyond 16 bit bounds', () => {
    const list = "1 ALT_COREKS_B_LY_07_U_123456"
    expect(() => encodeList(list)).toThrowError(/Unique ID/i)
  })

  it('should throw an error when trying to encode more than 65 of the same card', () => {
    const list = "66 ALT_CORE_B_AX_11_R1"
    expect(() => encodeList(list)).toThrowError(/quantity/i)
  })

  it('should filter out cards with a quantity of 0', () => {
    const list = "1 ALT_CORE_B_YZ_02_C\n0 ALT_CORE_B_AX_11_R1\n3 ALT_CORE_B_LY_28_C\n"
    const listWithoutZero = "1 ALT_CORE_B_YZ_02_C\n3 ALT_CORE_B_LY_28_C"
    const encoded = encodeList(list)
    const decoded = decodeList(encoded)
    expectEqualLists(decoded, listWithoutZero)
  })

  it('should encode an empty list', () => {
    const empty = encodeList("")
    expect(empty).toEqual("EAA")
    const decoded = decodeList(empty)
    expect(decoded).toEqual("")
  })
})