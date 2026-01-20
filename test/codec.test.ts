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
  "test/decklists/test_mana_orb.txt": "EBAg3hHfC8IA",
  "test/decklists/test_long_uniq.txt": "EBARGz4JpNnycPbPmBy2f__8",
  "test/decklists/test_extd_qty.txt": "EBAgTTMo",
  "test/decklists/test_products.txt": "EBAg04RrTJLU",
  "test/decklists/test_alize_1.txt": "EBAw3bR21djwTSA",
  "test/decklists/test_alize_2.txt": "ECAwm4xsMAgmxn04",
  "test/decklists/test_alize_neutrals.txt": "ECAgXwgGE-CPhAA",
  "test/decklists/test_bise_1.txt": "EBAw3bR21djwTSA",
  "test/decklists/test_bise_2.txt": "EEBBHATzMAltJzfAjcBC8eeQAIGyKBguTIA",
  "test/decklists/list_1offs.txt": "ECAU2RjKFlBScpaUlWVLJFkwysZc0wLFzMh2NTYZw0-GfIEXS4ZWtOmYNMRmyzgp6N-mcjOU",
  "test/decklists/list_2sets.txt": "ECAjGhnSHpR0s6gdRaqPWRrRVp64deQESnV0UqcdPA",
  "test/decklists/list_uniques.txt": "EBAVnBjhHww4lcSeILFNjDx5S-so2TPLDRcOHGX4iUOcWt1XazI5t8wW8g",
  "test/decklists/list_yzmir.txt": "EBAk3hnUK4h8daVOIvjFyx5h846zfTGuXmb6p9YuwPaHsgA",
  "test/decklists/test_collection.txt": "EWA_1GMUY0CkEA5DOYBmBA5hAGYimJ5jAGZCmRZkwVIA5lGZUFmYZmWZsAFWZsQ0AKZxmdBZoKaEDmkZpQaahmpCZrGa0CmwZsQKbRm1CJuKblqGakmq5qyaum35uScinIsSDXYa6CegyqeetgHrqSlFKVVI6WkmYroEA6DASoABqBBKhGoXqIaiQWowD_ajWo8NygKpCqRCqlKpUCqYamWpsIsAKpyqd6oGqEFqkqpQSqjqpAqrKq0CqwB6tGrUGq4quW4ZuHFSpuycjrJKyWsmrKJyjFaaym8svZ726-jnpJ6iUpYBTiGarqKqjupZqXJ-UGsIBbDAa3yt9bfxyMArgAW4RuFAbiO4kJuMrjQW5CuRBLlK5UD_BrmO5nucbnQK6CuhArpAW6jup7rG60Iuw7tLIayqsrnLa2Sdkwnldonoq6WVIxmCZmmaamyZumppqbHvBqibjm5cZXwPAgGwMB8fHH1x_R4QCyAcgQHISyF8iHIlyLK-QEyMcjQTJACyUslQPJgEyccnxfzA8oHKEHykcpQLKiypAcrHK0KywssQP8Dy0stXY72Wdl0dPenlWYVZmmeZnx1mpomoMX_wKqquabpm6px-cgnIMXcHJ4B0EAdDALYR2HGZoF2ItiQPYy2NBtkHZED2UdlQTZi2ZA9nLZ0D2gdoQTaR2lA9qHakG2strQbbB2xA9tLbUE24duQPbz29uhnpp6meslGOlpBmGZjmY8XcaZZmuA4GqZuCbim552admwiyBOBATgwG6AegQToS6FAuiLokD6Mej2mGA-kHpEF6UelQPpgC6cA-oATqQB6ouqQTqwB6tAusATrQG64euQT_kIpDKcTnIpzGc2nQZ1KdhnZZ3OeTnop7KfBn0Z9afin8Z_asZrWr0ndp7ae6mdZoMqxKsUBrIqzGs3rQa1Kthrca4GuRroq7OvDr0a-Gvlr8a_W9Zz2t4nuJ7mZ9gGwQBsMrxG8hvJbzK83vQr0W9QE_r2G9xvg75G-jvs78G_Hv0r-G_xzmc_ms5vOcBHAzzEcyHMmzMczyg_80LNRzYc2XNyzgc5HOXzoAc7HPBzxs9HPWz4c_HdJnOc4wE_tCPcR3Idybcy3Qd1HdX3Yd2Xdz3gd4feR3od6Xey3wt9Hfi38e3gR17uZ4mv5veb_ndZ3euBHgx7EuyPsy7Qu1Htn7ce3fuB7he5HuW7oe7Hu27w-9HvV74e_AL8BkICSIpGAUkGSLJMYzuSjJXkwyZA5OMnWT4BLUoAKUjKXlQypA5WMrxZxpYMsWWYwVgMtGWrLcZ2AKXDLll2OlNLymBTB5iMxeZFMlmWOOYHMxmazPAX3mhTRApqU2ObNNxm6BTgpwgU5AGdAFOynbzwAZ6AM-OfLT6slWqbbNxu5wF_36cPOMnGYvXONrOzp51NbqeLPIwSaeRjI-8rDf3JGKWhS0swmYYyrs6gGggDQgBoYBUQqIgVFKioJRho2FawDRxo70gqQgVJAKlHSnpY0tA6YNMxoN6aAdOOnPTzp6BVAqg1ROooDUiqTVMqm1UKqPVQCqxVZathTOBVc6wAdZOtAHWwC_64AVdKuoFXhrzWabNhxm2bGGWtM2zG01uU3LFt6u84-cfhPZ5K8reevVzrp408mehfSnpYdSRQhlMzSanNXgGsQLYQCsQA2M7IAVlGyoHZisyB2cbOgtoK0ILaRtKA2orUgtrK1oJbBtiCW0bagVuG3Ya_dvG3rb8CDwS4AFcSuKBXIbkgX_cyuaBXQrogV1O7Fdxu6BXgbwgl5K8oFeivSA3sb2gN8AO-jfUBvx35sTOKvITlJymLUlpJ2s8S-PXNnnT076s9auzXdosQpaqSXJpl1S-ZnM2mczRZo00vEj6rU1ua7Vlu13bpus3abxd9gXAgDghwYA4QAv3CLhMRDAbCjhUCww4ZcNjMC4bGpTw54dAsQWIQLEniUCxQ4pBMWWLQTGDjECxpY1BMcOOQfHlj0DyB5B8iORxoNskWSfJgDlByiCZUcq-WLLLlsEL_Ljl0BzBZhBMyWZQPNDmkFzZZtBM4WcQLOlnUBzw55dbO3reSYMpLUnmVQF-yuZvU4mdzPJok0majNUvJzmLzd6EAdEAWjLSFpED0o6VA9MOmQbTjp21A6hAdSAOqPVjq0B1gCa0dagOuPXILry177AdggWxHYrscDpwPZADswC2g7R9qe2HbIJty26CbgB9yO5bdFukC3Y7tBt4W8QHejvUG3w8uAv7nz1K7kmiGWzUJrM2erRN8nETma006bGJV1U7Ctne0ndwDwQB4Q8MAeIPEXiYf7fFPjAHxz46BcgeQgPJLkvyh5SB8sAeYAvNAHnHzx6AA9EAukfSQPpj1D6j9UuqgPWALrj2B7CA9key_aALtl3B7j90u6_eLvIEDHCAH-kIAyIpGUkGSNJRkrSY5OUoKUjKXlQyppWMsGWPLSlxS85gUxGYvMimZTNpoM1KatNim5TgpyM5adFOxnazwZ4gM9GetR5p82qbbVwvFzjJ087Gdjgs47ieVPamUTPboJUIqGVEKilRhoyA_1HOkFSSpRUsaW1MKmjTWpxU8qgNQaolUhqY1NqoNUeqjVWqx1cqwNYWsYobtZGtFWmrY1ta4NcaulXhrzWybphJ63erzOFweBcfORrJTlZzU6ueNPQmUzMZmk02anNXqwlYhsZWQrKNlazHZwB_bO1oK0jaWtQ2prWVsG2NbRtuIgNbjt429bgVxG4rccNEG5DcmuY3Q7qAN2K7jd2vA3hryd6G9LeyvbXwb419G-rfhxM4qcdOUnSTtcIW3j3077M92e9M2mizRprU1ubLN1q7XgTwR4MsIOEbCgD-4YsM2HLEDiGxI4lsUeLHFri8QKHGDjGxpY4seWQPIjkWyQ5J8mOTbKFlRyw5Z8uOXfMFmRzLZos2ecHOjnXzxZ5dlMnmZTOJnk1GqrOTnMTm60J6ItGOkLSlpgB046dtQWpPVDqx1b6wAf_WjrV1uA7Frh1za8tgWxLZDsm2Y7NtoO1LbFtx267gdyO5bdDum3Y7tt4e9Hevvh3y8yexPbmzzaJvk4ScJgJxZmdLOonYTs52lcEAeEXDLiFxR4xccuQPIXklyh5TcseWvMHmjzW5x88ugAK70G6J9IekvTLqD1H6o9VusXXLsF2R7L9oe03bHtt3B7i90e63eA",
  "test/decklists/test_all_sets.txt": "EMAgqXFToBCpK2LgMJuMbDAQICW0nN8CNwUKJ1Ur1BgstTmQQcJJCJwgIC5gi6gAkLmqKcSCgsmhipgLCyrIisUDAuj4kcRA",
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