import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../../components/nav";
import { useRouter } from 'next/router'
import Image from 'next/image'
import useSWR from 'swr'
import { useEffect } from "react";
import firstImage from "../../images/first.png";
import lastImage from "../../images/last.png";
import nextImage from "../../images/next.png";
import previousImage from "../../images/previous.png";
import greenPlus from "../../images/GreenPlus.png";
import saveKeyButton from "../../images/saveKey.jpg";
import blankImage from "../../images/blankImage.png";
import Multiselect from 'multiselect-react-dropdown';
import Select from "react-dropdown-select";
import { useStore, initializeStore } from "../../lib/store";
const baseURL = process.env.baseURL;

const review_metadata_path = () => {
    const { featureCode } = useStore();
    const pathHead = process.env.pathHead;
    return featureCode ? pathHead.concat(featureCode.featureCode) : '';
}

const display_data_entered_by = (pubDate) => {
    return new Date(pubDate).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })
}

const publication_metadata_path = (feature, publication) => {
    return publication.features_name;
}

const getComicStrip = (asset_uuid) => {
    if (!asset_uuid) return blankImage;
    return String(process.env.comicStrip).concat(asset_uuid);
}
const getActorImage = (imagePath, id) => {
    if (!imagePath) return blankImage;
    return process.env.actorImageBase.concat(id).concat('/').concat(imagePath);
}

const featureHome = () => {
    const { code } = useStore();
    return code ? baseURL.concat("/metadata/feature/").concat(code) : '';
}

export function getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    const initialProps = Document.getInitialProps(ctx)
    return { ...initialProps }
}

export function getServerSideProps() {
    const zustandStore = initializeStore()
    return {
        props: {
            initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
        },
    }
}

function saveForm(event, keyStore, tagsStore) {
    event.preventDefault();
    const saveForm = {
        userId: document.getElementById("userId").innerText,
        id: document.getElementById("pubId").innerText,
        feature_id: document.getElementById("featureId").innerText,
        feature_code: document.getElementById("featureCode").innerText,
        title: document.getElementById("title").value.replace(/"/g, '\\"').replace(/'/g, "\\'"),
        transcript: document.getElementById("transcript").value.replace(/"/g, '\\"').replace(/'/g, "\\'"),
        description: document.getElementById("description").value.replace(/"/g, '\\"').replace(/'/g, "\\'"),
        transcripts_id: document.getElementById("transcripts_id") ? document.getElementById("transcripts_id").innerText : null,
        description_id: document.getElementById("description_id") ? document.getElementById("description_id").innerText : null,
        syndicates: document.getElementById("synStore").innerHTML.toString().split('>')
            .filter(function (a) { return a.includes("synStore") })
            .map(function (item) { return parseInt(item.split('-')[1]) }),
        tags: tagsStore,
        // tags: document.getElementById("tagsStore").innerHTML.toString().split('>')
        //     .filter(function (a) { return a.includes("tagsStore") })
        //     .map(function (item) { return parseInt(item.split('-')[1]) }),
        // keys: document.getElementById("keyStore").innerHTML.toString().split('>')
        //     .filter(function (a) { return a.includes("keyStore") })
        //     .map(function (item) { return parseInt(item.split('-')[1]) }),
        keys: keyStore,
        category: document.getElementById("categoryStore").innerHTML.toString().split('>')[1].split('<')[0]
    }
    fetch(process.env.postSave, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveForm),
    })
}
function onSelectTags(event, setTags) {
    setTags(event);
}
function onSelectSyns(event, setSyndicates) {
    setSyndicates(event);
}
function selectedSyn(syn, id) {
    return syn ? syn.filter(function (a) { return a.value === id ? id : 0 }) : 0;
}

function selectedCat(cat, label) {
    return cat ? cat.filter(function (a) { return a.label === label ? label : '' }) : 0;
}
function onSelectKeys(event, onSelectKeys) {
    onSelectKeys(event);
}

function onSelectCategory(event, setCategory) {
    setCategory(event);
}

function setShowKeyEntry(setShow, show, setShowKeyError, keyErrorShow) {
    setShow(show = !show);
    setShowKeyError(keyErrorShow = true);
}

function saveKey(event, keys, setShowKeyError, keyErrorShow, setShow, show) {
    setShowKeyError(keyErrorShow = true);
    const key = document.getElementById("addKeys").value;
    let result = keys.filter(function (el) {
        return el.id == key.toLowerCase();
    });
    if (result.length > 0) {
        setShowKeyError(keyErrorShow = !keyErrorShow);
        return;
    }
    fetch(process.env.saveKeys, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: document.getElementById("addKeys").value.toLowerCase() }),
    })
    // Close text box
    document.getElementById("addKeys").value = '';
    setShow(show = true);
}

const handleKeyDown = e => {
    if (e.key === " ") {
        e.preventDefault();
    }
};

export default function feature(props) {
    const { userId, code, id, stripDate, setId, setCode, setDate,
        setTags, tagsStore, setSyndicates, syndicatesStore, keyStore,
        setKeys, categoryStore, setCategory, show, setShow, setShowKeyError, keyErrorShow } = useStore();
    // if (props === undefined) { return <p><h2>Loading...Undefined</h2></p> }
    let codeId;

    const router = useRouter();
    if (router != undefined) {
        codeId = router.query.codeId;
    }

    if ((code === null) && (codeId != null)) {
        new Date(codeId || codeId[1]) > 0 ? setId(codeId ? codeId[1] : 0) : setDate(codeId ? codeId[1] : 0);
        setCode(codeId ? codeId[0] : "");
    }
    const queryParams = id ? code + '/' + id : code + '/' + stripDate
    const { data: publicationData } = useSWR(() => process.env.basePublisher + queryParams);
    const { data: syndicates } = useSWR(process.env.readSyndicates);
    const { data: tags } = useSWR(process.env.readTags);
    const { data: category } = useSWR(process.env.readCategory);
    const { data: keys } = useSWR(process.env.readKeys);
    const { data: pubKeys } = useSWR(process.env.readPubKeys + id);
    const { data: pubTags } = useSWR(process.env.readPubTags + id);
    if ((pubKeys != undefined) && (pubKeys.length > 0) && (keyStore.length <= 0))
        setKeys(pubKeys);
    if ((pubTags != undefined) && (pubTags.length > 0) && (tagsStore.length <= 0))
        setTags(pubTags);

    const publication = publicationData ? {
        asset_uuid: publicationData ? publicationData[0].asset_uuid : "",
        description_text: publicationData ? publicationData[0].description_text : "",
        description_id: publicationData ? publicationData[0].description_id : null,
        feature_code: publicationData ? publicationData[0].feature_code : "",
        feature_id: publicationData ? publicationData[0].feature_id : "",
        features_name: publicationData ? publicationData[0].features_name : "",
        feature_category: publicationData ? publicationData[0].feature_category : "",
        id: publicationData ? publicationData[0].id : 0,
        publication_title: publicationData ? publicationData[0].publication_title : "",
        publish_date: publicationData ? publicationData[0].publish_date : "2022-03-30T05:00:00.000Z",
        syndicate_id: publicationData ? publicationData[0].syndicate_id : 0,
        transcript_text: publicationData ? publicationData[0].transcript_text : "",
        transcripts_id: publicationData ? publicationData[0].transcripts_id : null
    }
        : {};

    const firstId = publicationData ? publicationData[1].firstId : 0;
    const lastId = publicationData ? publicationData[2].lastId : 0;
    const nextId = publicationData ? publicationData[3].nextId : 0;
    const previousId = publicationData ? publicationData[4].previousId : 0;

    // Set the id if the parameter was a date rather than an ID
    if ((id === null) && ((publicationData ? publicationData[0].id : 0) > 0))
        setId(publicationData ? publicationData[0].id : 0);

    const { data: actors } = useSWR(() => process.env.readActors + id);

    const showKeyEntry = show;

    return <>
        <Menu />
        <div id="userId" hidden={true}>{userId}</div>
        <div id="transcripts_id" hidden={true}>{publication.transcripts_id}</div>
        <div id="description_id" hidden={true}>{publication.description_id}</div>
        <p></p>
        <form className="" >
            <>
                <div className="row">
                    <div >
                        <div className="content">
                            <div className="d-flex justify-content-center flex-nowrap offset-md-2">
                                <div className="col-2">
                                    <a href={firstId}><Image src={firstImage} /></a>
                                </div>
                                <div className="col-2">
                                    <a href={previousId}><Image src={previousImage} /></a>
                                </div>
                                <div className="col-4">
                                    <h5><a href={review_metadata_path()} >{publication.features_name}</a> {display_data_entered_by(publication.publish_date)}</h5>
                                </div>
                                <div className="col-2">
                                    <a href={nextId}><Image src={nextImage} /></a>
                                </div>
                                <div className="col-2">
                                    <a href={lastId}><Image src={lastImage} /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row "><hr className="rounded" />
                            <div className="col-6 text-right w-75">
                                <center>
                                    <a href={getComicStrip(publication.asset_uuid)}>
                                        <img id="comicStrip" src={getComicStrip(publication.asset_uuid)} />
                                    </a>
                                </center>
                            </div>
                            <div className="col-xs-4 content-section w-25 bg-info bg-lighten-xl text-dark rounded">
                                <div className="well well-data-entry js-data-entry-affix" >
                                    <div acceptCharset="UTF-8" >
                                        <div id="pubId" name="pubId" hidden={true} >{publication.id || 0}</div>
                                        <div id="featureId" name="featureId" hidden={true} >{publication.feature_id || 0}</div>
                                        <div id="featureCode" name="featureCode" hidden={true} >{publication.feature_code || ""}</div>
                                        <h5><p className="comic-id" >ID: {publication.id || 0}</p></h5><hr className="rounded" />
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="title-text">
                                                <h5>Title</h5></label>
                                            <textarea className="form-control" id="title" name="title" rows="3" maxLength="125" defaultValue={publication.publication_title} />
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="balloon-text"><h5>Transcript</h5></label>
                                            <textarea className="form-control" id="transcript" name="transcript" rows="6" defaultValue={publication.transcript_text} />
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="balloon-text"><h5>Description</h5></label>
                                            <textarea className="form-control" id="description" name="description" maxLength="125" rows="6" defaultValue={publication.description_text} />
                                        </div><hr className="rounded" />
                                        <div id="tagsStore" hidden={true}>
                                            {tagsStore.map(({ name, id }) => (
                                                <p key={"key-" + id} id={String("tagsStore-").concat(id)}>{name}</p>
                                            ))}
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label"><h5>Tags</h5></label>
                                            <Multiselect id="selectedTags"
                                                options={tags ? tags : [{ "id": 0, "name": "" }]}
                                                selectedValues={tagsStore}
                                                onSelect={(e) => onSelectTags(e, setTags)}
                                                onRemove={(e) => onSelectTags(e, setTags)}
                                                displayValue="name"
                                            />
                                        </div>
                                        <div id="synStore" hidden={true}>
                                            {syndicatesStore.map(({ value, label }) => (
                                                <p key={"key-" + value} id={String("synStore-").concat(value)}>{label}</p>
                                            ))}{true}
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label"><h5>Syndicates</h5></label>
                                            <Select options={syndicates ? syndicates : [{ "value": 0, "label": "Select Syndicates" }]}
                                                onChange={(e) => onSelectSyns(e, setSyndicates)}
                                                values={selectedSyn(syndicates ? syndicates : [{ "value": 0, "label": "Select Syndicates" }], publication.syndicate_id)} />
                                        </div>
                                        <div id="keyStore" hidden={true}>
                                            {keyStore && keyStore.map(({ name, id }) => (
                                                <p key={"key-" + id} id={String("keyStore-").concat(id)}>{name}</p>
                                            ))}{true}
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label"><h5>Keys{' '}{' '}{' '}
                                                <Image src={greenPlus} alt="Add Key" onClick={() => setShowKeyEntry(setShow, showKeyEntry, setShowKeyError, keyErrorShow)} width={20} height={20} />
                                            </h5>
                                            </label>
                                            <div hidden={showKeyEntry} >
                                                <strong>This will take time to add to the list</strong>
                                                <input id="addKeys" type="text" onKeyDown={handleKeyDown} />
                                                <Image src={saveKeyButton} alt="Add Key" onClick={(event) => { saveKey(event, keys, setShowKeyError, keyErrorShow, setShow, show); }} width={20} height={20} />
                                            </div>
                                            <div hidden={keyErrorShow} >
                                                <p className="bg-danger text-white"><strong>This Key already Exist in the list</strong></p>
                                            </div>
                                            <Multiselect id="selectedKeys"
                                                options={keys ? keys : [{ "id": 0, "name": "Select Keys" }]}
                                                selectedValues={keyStore}
                                                onSelect={(e) => onSelectKeys(e, setKeys)}
                                                onRemove={(e) => onSelectKeys(e, setKeys)}
                                                displayValue="name"
                                                selectionLimit={20}
                                            />
                                        </div>
                                        <div id="categoryStore" hidden={true}>
                                            {categoryStore.map(({ label, value }) => (
                                                <p key={"key-" + value} id={String("categoryStore-").concat(value)}>{label}</p>
                                            ))}
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label"><h5>Category</h5></label>
                                            <Select options={category ? category : [{ "value": 0, "label": "Select Category" }]}
                                                onChange={(e) => onSelectCategory(e, setCategory)}
                                                values={selectedCat(category ? category : [{ "value": 0, "label": "Select Category" }], publication.feature_category)} />
                                        </div>
                                        <hr className="rounded" />
                                        <input className="btn btn-success btn-lg js-metadata-form-submit" name="commit" type="submit" value="Save &amp; Next" onClick={(event) => saveForm(event, keyStore, tagsStore)} />
                                        <a href="/metadata" className="btn btn-default btn-lg">Cancel</a>
                                        <hr className="rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row"><br /><hr className="rounded" />
                            <div className="col-sm-12 js-character-entry">
                                <div className="well well-data-entry">
                                    <h4 className="text-center">{publication.features_name} Characters Shown</h4>

                                    <div className="text-center" hidden={actors && actors.length > 0} >
                                        <p>No characters have been added for this feature.</p>
                                        <p><a href={featureHome()} className="btn btn-primary" target="_new">Manage {publication.features_name} Characters</a></p>
                                    </div>

                                    <div className="text-center" hidden={!actors || (actors && actors.length <= 0)}>
                                        <div className="row d-flex justify-content-center">
                                            {actors && actors != [] && actors.map((pic) => (
                                                <div key={"actor-" + pic.id} className="col-md-2" >
                                                    <figure  >
                                                        <span>
                                                            <a href={getActorImage(pic.image_path, pic.id)}>
                                                                <img key={"actor-" + pic.id} src={getActorImage(pic.image_path, pic.id)} width="100" height="100" />
                                                                <figcaption>{pic.name}</figcaption>
                                                            </a>
                                                        </span>
                                                    </figure>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </form>
    </>
}

