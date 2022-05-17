import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineCheck, AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

import Web3 from 'web3'
import nft from '../abi/abi.json'
import nftm from '../abi/nftn.json'
import ERC20 from '../abi/ERC20.json'
import { Link } from 'react-router-dom';
import fromExponential from 'from-exponential'
import { addrs } from '../abi/address'
import stack from '../abi/stack.json'
import nftn from '../abi/nftn.json'
// import '@codemirror/theme-monokai'
import { Modal, Spinner } from 'react-bootstrap'
import { oneDark } from '@codemirror/theme-one-dark';
import img1 from '../img/img1.png'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
const loop = [1, 2, 3, 1, 2, 3]
function Main({ acc, web3main, prov }) {
    console.log("address", addrs)
    const location = useLocation()

    const { id } = useParams()
    console.log("Acccc", acc)
    const [next, setnext] = useState(0)
    const [done, setdone] = useState(false)
    const [csvFile, setCsvFile] = useState();
    const [tokval, settokval] = useState()
    const [tokname, settokname] = useState()
    const [chainid, setchainid] = useState()
    const [show, setShow] = useState(false);
    const [fdata, setfdata] = useState()
    const handleClose = () => setShow(false);
    const [text, settext] = useState()
    const [all, setall] = useState()
    const [adlist, setadlist] = useState([])
    const [vallist, setvallist] = useState()
    const [tok, settok] = useState()
    const [total, settotal] = useState()
    const [balance, setbalance] = useState()
    const [mirror, setmirror] = useState()
    const [err, seterr] = useState([])
    const [errlist, seterrlist] = useState([])
    const [lineerr, setlineerr] = useState([])
    const [est, setest] = useState()
    const [maintoken, setmaintoken] = useState()
    const [add, setadd] = useState()
    const [tname, settname] = useState('')
    const [link, setlink] = useState('')
    const [dec, setdec] = useState()
    console.log('mirr', [adlist, vallist])


    const breakd = (e) => {
        setfdata(e)
        seterrlist([''])
        const sptdata = e?.split('\n')
        console.log('vvv', sptdata)
        const ma = sptdata?.map((v) => {
            return v?.split(',')
        })
        const filma = ma?.filter(function (el) {
            return el?.length === 2;
        });
        settext(filma)
        const addlist = ma?.map((v) => {
            return v[0] === "" || v[0] === undefined || v[0] === "\r" || v[0] === "\t" ? null : v[0]


        })
        const filadd = addlist?.filter(function (el) {
            return el != null;
        });
        const vallist = ma?.map((v) => {
            return v[1] === "" || v[1] === undefined || v[0] === "\r" || v[0] === "\t" ? null : v[1]

        })
        const filval = vallist?.filter(function (el) {
            return el != null;
        });
        if (web3main && acc) {
            const errlistv = filma?.map((v, i) => {
                if (v[0] === "" || v[0] === undefined || v[0] === "\r" ? null : v[0]) {
                    return [web3main.utils.isAddress(v[0]), i + 1];
                }

            })
            const errlistM = errlistv?.filter(function (el) {
                return el ? el[0] : null != null;
            });
            seterrlist(errlistv)
        }


        setadlist(filadd)
        setvallist(filval)

    }

    console.log('err', errlist)
    useEffect(async () => {
        if (web3main && acc && prov) {
            const chainId = await prov.request({ method: 'eth_chainId' });
            console.log('chain', chainid)

            setchainid(chainId)
            if (chainId == 0x38) {
                setadd("0xE61e456DE2f18c4D7aa6bbEF78A141CdD48d5305")
                settname("BNB")
                setlink('https://bscscan.com/search?f=0&q=')
            }
            if (chainId == 0x13881) {
                setadd("0x8fb1036C3Ba7CD7861FAc2f68d77a5836cE5191F")
                settname("MATIC")
                setlink("https://mumbai.polygonscan.com/tx/")

            }
            if (chainId == 0xfa2) {
                setadd("0xb5f05Cc05E3069ff4b092AF7F904FD624Ef8f561")
                settname("FTM")
                setlink('https://testnet.ftmscan.com/tx/')

            }
        }

    }, [web3main, acc, prov])


    const breakdnew = async (e) => {
        // console.log('vvv',e.target.value?.split('\n'))
        console.log('toktype', tok)
        seterr([""])
        if (tok === "BNB" || tok === "MATIC" || tok === "FTM" || tok?.length > 20) {
            if (adlist?.length === vallist?.length) {
                const fildata = errlist?.filter((p) => p[0] === false)
                console.log("ff", fildata)
                if (fildata?.length === 0) {
                    setnext(next + 1)
                    if (tok === "BNB" || tok === "MATIC" || tok === "FTM") {

                        balancebnb()
                        setnext(next + 1)
                    } else {
                        balancetok()
                        balancebnb()
                        setnext(next + 1)

                    }

                } else {
                    setlineerr(fildata)
                }


            } else {
                seterr([...err, "Please select right the format "])

            }

        } else {
            seterr([...err, "Please select a token address or select BNB"])
        }



    }
    const totalamt = vallist?.reduce((curr, prev) => (Number(curr) + Number(prev)), 0)
    console.log('amt', totalamt)

    const approve = async () => {
        if (web3main && acc) {
            const accounts = await web3main.eth.getAccounts();
            //  console.log(accounts);
            let userwalletaddresss = accounts[0];
            // web3main = new Web3(web3main && acc);
            const ercContract = await new web3main.eth.Contract(ERC20, tok);
            let amountADesired = web3main.utils.toBN(fromExponential(parseInt((parseFloat(totalamt)) * Math.pow(10, dec))));
            ercContract.methods.approve(add, amountADesired).send({ from: userwalletaddresss })
                .then((result) => {
                    console.log(result);
                    //     false)
                    const list = vallist?.map(v => web3main.utils.toBN(fromExponential(Number(v) * Math.pow(10, dec))))
                    console.log(list)
                    let token = new web3main.eth.Contract(nft, add)
                    let amountIn = web3main.utils.toBN(fromExponential((0.1) * Math.pow(10, dec)));
                    let amounttot = web3main.utils.toBN(fromExponential((totalamt) * Math.pow(10, dec)));
                    token.methods.batchTokenTransfer(
                        userwalletaddresss,
                        adlist,
                        list,
                        tok,
                        amounttot,
                        true
                    ).estimateGas({ from: userwalletaddresss, value: amountIn })
                        .then((fees) => {
                            console.log(fees);
                            setest(fees)
                        }).catch()
                    token.methods.batchTokenTransfer(
                        userwalletaddresss,
                        adlist,
                        list,
                        tok,
                        amounttot,
                        true
                    ).send({ from: userwalletaddresss, value: amountIn })
                        .then((fees) => {
                            console.log(fees);
                            setnext(next + 1)
                            settotal(fees?.transactionHash);
                        }).catch()
                }).catch()


        }
    }

    const balancebnb = async () => {
        if (web3main && acc) {
            const accounts = await web3main.eth.getAccounts();
            //         //  console.log(accounts);
            let userwalletaddresss = accounts[0];
            console.log("cccxxx", userwalletaddresss)
            const accountbal = await web3main.eth.getBalance(userwalletaddresss);;
            //  console.log(accounts); 
            console.log('balance', accountbal / 1000000000000000000)
            setbalance(accountbal / 1000000000000000000)
            // settokval('')



        }
    }
    const balancetok = async () => {
        if (web3main && acc) {
            const accounts = await web3main.eth.getAccounts();
            //         //  console.log(accounts);
            let userwalletaddresss = accounts[0];
            let token = new web3main.eth.Contract(ERC20, tok)
            token.methods.balanceOf(userwalletaddresss).call({ from: userwalletaddresss })
                .then((result) => {
                    console.log("vv", result);
                    token.methods.decimals().call({ from: userwalletaddresss })
                        .then((resultone) => {
                            console.log("decimal",resultone)
                            setdec(Number(resultone))
                            settokval(parseInt(Number(result) / 10 ** Number(resultone)))
                        })

                    token.methods.symbol().call({ from: userwalletaddresss })
                        .then((result) => {
                            console.log("vvname", result);
                            // settok(Number(result) / 1000000000)
                            settokname(result)

                        }).catch()

                }).catch()



        }
    }

    const buybnb = async () => {
        if (web3main && acc) {
            const accounts = await web3main.eth.getAccounts();
            //         //  console.log(accounts);
            let userwalletaddresss = accounts[0];

            const list = vallist?.map(v => web3main.utils.toBN(fromExponential(parseInt(Number(v) * Math.pow(10, 18)))))
            console.log("checkii", chainid)
            if (chainid == 0x38) {
                setmaintoken("0xE61e456DE2f18c4D7aa6bbEF78A141CdD48d5305")
                let token = new web3main.eth.Contract(nft, "0xE61e456DE2f18c4D7aa6bbEF78A141CdD48d5305")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt(((totalamt) + 0.1) * Math.pow(10, 18))));
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).send({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        setnext(next + 1)
                        settotal(fees?.transactionHash);
                    }).catch()
            }
            if (chainid == 0x13881) {
                // alert('vv')
                setmaintoken("0x5a2bcecA1B040dad76Bc107EE627b7187bbAe91C")
                let token = new web3main.eth.Contract(nft, "0x8fb1036C3Ba7CD7861FAc2f68d77a5836cE5191F")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt(((totalamt) + 0.1) * Math.pow(10, 18))));
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).send({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        setnext(next + 1)
                        settotal(fees?.transactionHash);
                    }).catch()

            }
            if (chainid == 0xfa2) {
                setmaintoken("0x15C0311cD2e0e89c390B43B4e280B8f853C69bD4")
                let token = new web3main.eth.Contract(nft, "0xb5f05Cc05E3069ff4b092AF7F904FD624Ef8f561")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt(((totalamt) + 0.1) * Math.pow(10, 18))));
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).send({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        setnext(next + 1)
                        settotal(fees?.transactionHash);
                    }).catch()
            }





        }
    }
    const buybnbest = async () => {
        // alert('vv')
        if (web3main && acc) {
            const accounts = await web3main.eth.getAccounts();
            //         //  console.log(accounts);
            let userwalletaddresss = accounts[0];
            console.log('bnb', tok)
            if (tok == "BNB") {

                console.log('BNB')

                const list = vallist?.map(v => web3main.utils.toBN(fromExponential(parseInt(Number(v) * Math.pow(10, 18)))))
                console.log("list", { vallist, list })
                let token = new web3main.eth.Contract(nft, "0xE61e456DE2f18c4D7aa6bbEF78A141CdD48d5305")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt((totalamt + 0.1) * Math.pow(10, 18))));
                console.log("list", { vallist, list, totalamt, amountIn })
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).estimateGas({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        console.log('esti', fees)
                        setest(fees)
                    }).catch()
            }
            if (tok == "MATIC") {
                console.log('MATIC')
                const list = vallist?.map(v => web3main.utils.toBN(fromExponential(parseInt(Number(v) * Math.pow(10, 18)))))
                console.log("list", vallist)
                let token = new web3main.eth.Contract(nft, "0x8fb1036C3Ba7CD7861FAc2f68d77a5836cE5191F")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt((totalamt + 0.1) * Math.pow(10, 18))));
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).estimateGas({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        console.log('esti', fees)
                        setest(fees)
                    }).catch()
            }
            if (tok == "FTM") {
                console.log('FTM')

                const list = vallist?.map(v => web3main.utils.toBN(fromExponential(parseInt(Number(v) * Math.pow(10, 18)))))
                console.log(list)
                let token = new web3main.eth.Contract(nft, "0xb5f05Cc05E3069ff4b092AF7F904FD624Ef8f561")
                let amountIn = web3main.utils.toBN(fromExponential(parseInt((totalamt + 0.1) * Math.pow(10, 18))));
                token.methods.batchTokenTransfer(
                    userwalletaddresss,
                    adlist,
                    list,
                    "0x0000000000000000000000000000000000000000",
                    amountIn,
                    false
                ).estimateGas({ from: userwalletaddresss, value: amountIn })
                    .then((fees) => {
                        console.log('esti', fees)
                        setest(fees)
                    }).catch()
            }
            if (tok !== "BNB" && tok !== "FTM" && tok !== "MATIC") {
                console.log('tokerrr', tok)


                const ercContract = await new web3main.eth.Contract(ERC20, tok);
                let amountADesired = web3main.utils.toBN(fromExponential(parseInt(parseInt((parseFloat(totalamt)) * Math.pow(10, 9)))));
                ercContract.methods.approve(add, amountADesired).estimateGas({ from: userwalletaddresss })
                    .then((result) => {
                        console.log("tokast", result);
                        setest(result)
                    }).catch()
            }






        }
    }

    const finalbuy = () => {
        if (tok === "BNB" || tok === "MATIC" || tok === "FTM") {
            buybnb()

        } else {
            approve()

        }
    }
    const submit = (data) => {
        const file = data;
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;
            console.log("cvfile", text);
            breakd(text)
        }

        reader.readAsText(file);
    }
    console.log('tokv', tokval)

    return (
        <div className='main pt-5'>

            <div className='row'>
                <div className='col-md-6 offset-md-3 col-12 offset-0'>
                    <div className='b-steps'>
                        <div class="steps is-primary is-animated is-rounded">
                            <ul class="step-items">
                                <li class={next >= 0 ? "step-item is-primary is-previous is-active" : "step-item is-primary "}>
                                    <a class="step-link is-clickable">
                                        <div class="step-marker"></div>
                                        <div class="step-details">
                                            <span class="step-title">Prepare</span>
                                        </div>
                                    </a>
                                </li>
                                <li class={next >= 1 ? "step-item is-primary is-previous is-active" : "step-item is-primary "}>
                                    <a class="step-link is-clickable"><div class="step-marker">
                                    </div>
                                        <div class="step-details">
                                            <span class="step-title">Approve</span>
                                        </div>
                                    </a>
                                </li>
                                <li class={next >= 2 ? "step-item is-primary is-previous is-active" : "step-item is-primary "}>
                                    <a class="step-link">
                                        <div class="step-marker">
                                        </div>
                                        <div class="step-details">
                                            <span class="step-title">Multisend</span>
                                        </div></a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div className='row'>
                <div className='col-md-8 offset-md-2 col-12 offset-0'>
                    <div className="row pb-5 ">
                        {
                            done ? null :
                                next === 0 ?
                                    <>
                                        <div className='col-md-10 offset-md-1 col-12 col-0 px-4'>
                                            <h4 className='am'>Token</h4>
                                            <input type="text" placeholder='Token Address' className='inp' value={tok} list='tok' onChange={(e) => settok(e.target.value)} />
                                            <datalist id='tok' className='w-100'>
                                                {
                                                    chainid == 0x38 ? <option className='w-100' value="BNB">BNB Smart Chain Native Currency</option> : null
                                                }
                                                {
                                                    chainid == 0x13881 ? <option className='w-100' value="MATIC">POLYGON</option> : null
                                                }
                                                {
                                                    chainid == 0xfa2 ? <option className='w-100' value="FTM">FANTOM</option> : null
                                                }


                                            </datalist>


                                            <h4 className='am'>Address with Amounts</h4>
                                            <CodeMirror
                                                value={fdata}
                                                height="300px"
                                                theme={oneDark}
                                                extensions={[javascript({ jsx: true })]}
                                                className="mt-1 codem"
                                                onChange={(value, viewUpdate) => {
                                                    breakd(value)
                                                    // console.log(value)
                                                }}
                                            />
                                        </div>
                                        <div className='col-md-10 offset-md-1 col-12 col-0 px-4'>
                                            {/* <form id='csv-form'> */}
                                            <input
                                                type='file'
                                                accept='.csv'
                                                // id='csvFile'
                                                onChange={(e) => {
                                                    submit(e.target.files[0])
                                                }}
                                                id="inputGroupFile01"
                                            >
                                            </input>
                                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose CSV file</label>
                                            <br />
                                            {/* <button onClick={(e) => {
                                                e.preventDefault()
                                                if (csvFile) submit() 
                                            }}>
                                                Submit
                                            </button> */}
                                            {/* </form> */}
                                        </div>
                                        <div className='col-12 px-4 errs '>
                                            {
                                                err?.map((v) => {
                                                    return <p>{v}</p>
                                                })
                                            }

                                        </div>
                                        <div className='col-12 px-4 errs '>
                                            {
                                                lineerr?.map((v) => {
                                                    return <p>Line {v[1]}: Not a valid address  </p>
                                                })
                                            }

                                        </div>
                                        {


                                            <div className='col-12 px-4 btndiv'>
                                                <button onClick={() => {

                                                    breakdnew()

                                                }
                                                }

                                                >Next <AiFillCaretRight /> </button>
                                            </div>

                                        }

                                    </> : null
                        }
                        {
                            done ? null :
                                next === 1 ?
                                    <>

                                        <div className='col-12 mt-5'>

                                            <div className='row'>
                                                {/* <div className='col-md-3 col-12'>
                                                    <div className='dtel'>
                                                        <h3>∞</h3>
                                                        <p>Your Current multisender approval</p>

                                                    </div>
                                                </div> */}
                                                <div className='col-md-4 col-12'>
                                                    <div className='dtel'>
                                                        <h3>{totalamt.length >= 6 ? totalamt.toFixed(20) : totalamt} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                                                        <p>Total number of tokens to be send</p>

                                                    </div>
                                                </div>
                                                <div className='col-md-4 col-12'>
                                                    <div className='dtel'>
                                                        <h3>{tok === "BNB" || tok === "MATIC" || tok === "FTM" ? balance : tokval} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                                                        <p>Your token balance</p>

                                                    </div>
                                                </div>
                                                <div className='col-md-3 col-12'>
                                                    <div className='dtel'>
                                                        <h3>{
                                                        } {tname}</h3>
                                                        <p>Your {tname} balance</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className='th4'>List of recipients</h4>
                                        <div className='col-12 col-xl-8 col-md-10 offset-md-1 offset-xl-2 tableh'>

                                            <table className='w-100'>
                                                <tr>
                                                    <th>Address</th>
                                                    <th>Amount</th>
                                                    {/* <th>Country</th> */}
                                                </tr>
                                                {
                                                    text?.map((v, i) => {
                                                        return <tr>
                                                            <td>{v[0]}</td>
                                                            <td>{v[1]}</td>

                                                        </tr>
                                                    })
                                                }


                                            </table>
                                        </div>
                                        <div className='col-12 px-4 mt-3 btndiv'>
                                            {/* <button className="mx-2" onClick={balancetok} ><AiFillCaretLeft /> Prev</button> */}
                                            <button onClick={() => {
                                                buybnbest()

                                                setnext(next + 1)
                                            }} >Next <AiFillCaretRight /> </button>
                                        </div>
                                    </> : null
                        }
                        {
                            done ? null :
                                next === 2 ?
                                    <>
                                        {/* <div className='col-12 px-4'>
                                            <h4 style={{ color: 'white', marginTop: '15px' }}>Sucessfull:{total}</h4>
                                        </div> */}
                                        <div className='row'>
                                            <div className='col-12 mt-5'>
                                                <div className='row'>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>{vallist?.length}</h3>
                                                            <p>Total number of address</p>

                                                        </div>
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>{totalamt} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                                                            <p>Total number of tokens to be send</p>

                                                        </div>
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>{tokval ? tokval : balance} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                                                            <p>Your token balance</p>

                                                        </div>
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>1</h3>
                                                            <p>Total transaction needed</p>

                                                        </div>
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>{balance} {tname}</h3>
                                                            <p>Your {tname} balance</p>

                                                        </div>
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <div className='dtel'>
                                                            <h3>{est / 100000000} {tname}</h3>
                                                            <p>Transaction Fees</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 px-4 mt-3 btndiv'>
                                            {/* <button className="mx-2" onClick={() => setnext(next - 1)} ><AiFillCaretLeft /> Prev</button> */}
                                            <button onClick={finalbuy} >Send <AiFillCaretRight /> </button>
                                        </div>


                                    </> : null
                        }
                        {
                            done ? null :
                                next === 3 ?
                                    <>
                                        {/* <div className='col-12 px-4'>
                                            <h4 style={{ color: 'white', marginTop: '15px' }}>Sucessfull:{total}</h4>
                                        </div> */}
                                        <div className='row suctran'>
                                            <h4>Transaction Sucessfull</h4>
                                            <a href={`${link}${total}`} target="_blank">View transaction Details</a>

                                        </div>



                                    </> : null
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Main
