import { getHqData } from '@/app/actions/hq'
import HqBuilder from '@/components/hq/hq-builder'

export const metadata = {
    title: 'Club HQ | Kickoff Club',
    description: 'Manage your football franchise headquarters.'
}

export default async function ClubHQPage() {
    const hqData = await getHqData()
    return <HqBuilder initialData={hqData} />
}
